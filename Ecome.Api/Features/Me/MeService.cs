using Ecome.Api.Common.Auth;
using Ecome.Api.Common.Results;
using Ecome.Api.Common.Utils;
using Ecome.Api.Data;
using Ecome.Api.Features.Auth;
using Ecome.Api.Features.Me.Responses;
using Microsoft.EntityFrameworkCore;

namespace Ecome.Api.Features.Me;

public class MeService(AppDbContext db, IamPermissionService iamService, JwtService jwtService)
{
    public async Task<Result<MeResponse>> GetMeAsync(Guid userId, CancellationToken ct)
    {
        var profile = await db.Users
            .AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.Name,
                u.Phone,
                u.PhotoUrl,
                u.BackgroundUrl,
                u.Bio,
                u.CreatedAt
            })
            .FirstOrDefaultAsync(ct);

        if (profile is null)
            return Error.NotFound("User not found.");

        var access = await iamService.GetUserAccessAsync(userId, ct);

        return new MeResponse(
            profile.Id,
            profile.Email,
            profile.Name,
            profile.Phone,
            profile.PhotoUrl,
            profile.BackgroundUrl,
            profile.Bio,
            profile.CreatedAt,
            access.Roles,
            access.Permissions
        );
    }

    public async Task<Result<List<UserSessionItemResponse>>> GetSessionsAsync(
        Guid userId,
        string? currentRefreshToken,
        Guid currentSessionIdFromJwt,
        CancellationToken ct)
    {
        Guid? matchedSessionId = null;

        if (!string.IsNullOrWhiteSpace(currentRefreshToken))
        {
            var hash = jwtService.HashToken(currentRefreshToken);
            matchedSessionId = await db.RefreshTokens
                .Where(rt => rt.TokenHash == hash)
                .Select(rt => (Guid?)rt.SessionId)
                .FirstOrDefaultAsync(ct);
        }

        var now = DateTime.UtcNow;
        var activeSessions = await db.DeviceSessions
            .AsNoTracking()
            .Where(s => s.UserId == userId && s.RevokedAt == null && s.ExpiresAt > now)
            .ToListAsync(ct);

        var result = activeSessions.Select(s =>
        {
            var isCurrent = (matchedSessionId.HasValue && s.Id == matchedSessionId.Value)
                            || (currentSessionIdFromJwt != Guid.Empty && s.Id == currentSessionIdFromJwt);

            var parsed = UserAgentParser.Parse(s.UserAgent);

            return new UserSessionItemResponse(
                s.Id,
                s.IpAddress,
                parsed.Browser,
                parsed.Os,
                parsed.DeviceType,
                s.UserAgent,
                s.CreatedAt,
                s.LastUsedAt,
                s.ExpiresAt,
                isCurrent
            );
        })
        .OrderByDescending(s => s.IsCurrent)
        .ThenByDescending(s => s.LastUsedAt ?? s.CreatedAt)
        .ToList();

        return result;
    }

    public async Task<Result<bool>> RevokeSessionAsync(
        Guid userId,
        Guid sessionId,
        string? currentRefreshToken,
        Guid currentSessionIdFromJwt,
        CancellationToken ct)
    {
        var session = await db.DeviceSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId, ct);

        if (session is null)
            return Error.NotFound("Session not found.");

        Guid? currentSessionId = null;
        if (!string.IsNullOrWhiteSpace(currentRefreshToken))
        {
            var hash = jwtService.HashToken(currentRefreshToken);
            currentSessionId = await db.RefreshTokens
                .Where(rt => rt.TokenHash == hash)
                .Select(rt => (Guid?)rt.SessionId)
                .FirstOrDefaultAsync(ct);
        }

        if (!currentSessionId.HasValue && currentSessionIdFromJwt != Guid.Empty)
        {
            currentSessionId = currentSessionIdFromJwt;
        }

        var isCurrent = currentSessionId.HasValue && session.Id == currentSessionId.Value;

        if (isCurrent)
            return Error.BadRequest("Cannot revoke your current session. Use logout instead.");

        session.RevokedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        return true;
    }

    public async Task<Result<RevokeOthersResponse>> RevokeOtherSessionsAsync(
        Guid userId,
        string? currentRefreshToken,
        Guid currentSessionIdFromJwt,
        CancellationToken ct)
    {
        Guid? currentSessionId = null;
        if (!string.IsNullOrWhiteSpace(currentRefreshToken))
        {
            var hash = jwtService.HashToken(currentRefreshToken);
            currentSessionId = await db.RefreshTokens
                .Where(rt => rt.TokenHash == hash)
                .Select(rt => (Guid?)rt.SessionId)
                .FirstOrDefaultAsync(ct);
        }

        if (!currentSessionId.HasValue && currentSessionIdFromJwt != Guid.Empty)
        {
            currentSessionId = currentSessionIdFromJwt;
        }

        var now = DateTime.UtcNow;
        var query = db.DeviceSessions
            .Where(s => s.UserId == userId && s.RevokedAt == null && s.ExpiresAt > now);

        if (currentSessionId.HasValue)
        {
            query = query.Where(s => s.Id != currentSessionId.Value);
        }

        var otherSessions = await query.ToListAsync(ct);
        foreach (var s in otherSessions)
        {
            s.RevokedAt = now;
        }

        await db.SaveChangesAsync(ct);

        return new RevokeOthersResponse(otherSessions.Count);
    }
}
