using Ecome.Api.Common.Results;
using Ecome.Api.Data;
using Ecome.Api.Data.Entities;
using Ecome.Api.Features.Auth.Dtos;
using Ecome.Api.Features.Auth.Responses;
using Microsoft.EntityFrameworkCore;
using AuthEntity = Ecome.Api.Data.Entities.Auth;
using UserEntity = Ecome.Api.Data.Entities.User;

namespace Ecome.Api.Features.Auth;

public class AuthService(AppDbContext db, JwtService jwtService)
{
    public async Task<Result<TokensResponse>> ExternalLoginAsync(
        string provider,
        string providerKey,
        string? email,
        string? name,
        string? ipAddress,
        string? userAgent,
        CancellationToken ct)
    {
        var normalizedEmail = email?.Trim().ToLowerInvariant();

        var existingAuth = await db.Auths
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Provider == provider && a.ProviderKey == providerKey, ct);

        UserEntity user;

        if (existingAuth is not null)
        {
            user = existingAuth.User;
            user.LastSeenAt = DateTime.UtcNow;
        }
        else
        {
            var existingUser = !string.IsNullOrWhiteSpace(normalizedEmail)
                ? await db.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail, ct)
                : null;

            if (existingUser is not null)
            {
                user = existingUser;
                user.LastSeenAt = DateTime.UtcNow;

                db.Auths.Add(new AuthEntity
                {
                    Provider = provider,
                    ProviderKey = providerKey,
                    UserId = user.Id
                });
            }
            else
            {
                user = new UserEntity
                {
                    Email = normalizedEmail ?? $"{provider.ToLowerInvariant()}_{providerKey}@noemail.ecome.local",
                    Name = string.IsNullOrWhiteSpace(name) ? "Người dùng ECOME" : name.Trim(),
                    Password = null
                };

                db.Users.Add(user);
                db.Auths.Add(new AuthEntity
                {
                    Provider = provider,
                    ProviderKey = providerKey,
                    UserId = user.Id
                });
            }
        }

        return await CreateSessionAndTokensAsync(
            new TokenPayload(user.Id, user.Email),
            ipAddress,
            userAgent,
            ct);
    }

    public async Task<Result<TokensResponse>> RefreshTokenAsync(
        string? refreshToken,
        string? ipAddress,
        string? userAgent,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            return Error.Unauthorized("Invalid refresh token.");

        var tokenHash = jwtService.HashToken(refreshToken);

        var tokenData = await db.RefreshTokens
            .Where(r => r.TokenHash == tokenHash)
            .Select(r => new
            {
                r.Id,
                r.SessionId,
                r.ExpiresAt,
                r.UsedAt,
                SessionRevokedAt = r.Session.RevokedAt,
                r.Session.UserId,
                UserEmail = r.Session.User.Email
            })
            .FirstOrDefaultAsync(ct);

        if (tokenData is null)
            return Error.Unauthorized("Invalid refresh token.");

        var now = DateTime.UtcNow;

        if (tokenData.UsedAt is not null)
        {
            // Grace period 10s: tránh đá nhầm user khi 2 tab trình duyệt refresh cùng lúc
            if (now - tokenData.UsedAt.Value <= TimeSpan.FromSeconds(10))
                return Error.Unauthorized("Refresh token rotation in progress.");

            await db.DeviceSessions
                .Where(s => s.Id == tokenData.SessionId)
                .ExecuteDeleteAsync(ct);

            return Error.Unauthorized("Refresh token reuse detected. Session revoked.");
        }

        if (tokenData.ExpiresAt <= now || tokenData.SessionRevokedAt is not null)
            return Error.Unauthorized("Refresh token expired.");

        await using var tx = await db.Database.BeginTransactionAsync(ct);

        var newRefreshTokenId = Guid.CreateVersion7();

        var updated = await db.RefreshTokens
            .Where(r => r.Id == tokenData.Id && r.UsedAt == null)
            .ExecuteUpdateAsync(s => s
                .SetProperty(r => r.UsedAt, now)
                .SetProperty(r => r.ReplacedById, newRefreshTokenId), ct);

        if (updated == 0)
        {
            await tx.RollbackAsync(ct);
            return Error.Unauthorized("Refresh token has already been used.");
        }

        // 2. Sinh cặp token mới và lưu
        var payload = new TokenPayload(tokenData.UserId, tokenData.UserEmail);
        var newTokens = jwtService.GenerateTokens(payload, tokenData.SessionId);

        db.RefreshTokens.Add(new RefreshToken
        {
            Id = newRefreshTokenId,
            SessionId = tokenData.SessionId,
            TokenHash = newTokens.TokenHash,
            ExpiresAt = now.AddDays(30)
        });
        await db.SaveChangesAsync(ct);

        var sessionExpiresAt = now.AddDays(30);
        await db.DeviceSessions
            .Where(s => s.Id == tokenData.SessionId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(x => x.LastUsedAt, now)
                .SetProperty(x => x.ExpiresAt, sessionExpiresAt)
                .SetProperty(x => x.IpAddress, x => ipAddress ?? x.IpAddress)
                .SetProperty(x => x.UserAgent, x => userAgent ?? x.UserAgent), ct);

        await tx.CommitAsync(ct);
        return newTokens;
    }

    public async Task<Result<bool>> LogoutAsync(Guid userId, Guid sessionId, CancellationToken ct)
    {
        var deletedRows = await db.DeviceSessions
            .Where(s => s.Id == sessionId && s.UserId == userId)
            .ExecuteDeleteAsync(ct);

        if (deletedRows == 0)
            return Error.NotFound("Session not found.");

        await db.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(u => u.LastSeenAt, DateTime.UtcNow), ct);

        return true;
    }

    public async Task<Result<TokensResponse>> LoginAsync(
        LoginRequest request,
        string? ipAddress,
        string? userAgent,
        CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var existingUser = await db.Users
            .Where(u => u.Email == email)
            .Select(u => new { u.Id, u.Email, u.Password })
            .FirstOrDefaultAsync(ct);

        if (existingUser is null
            || string.IsNullOrEmpty(existingUser.Password)
            || !BCrypt.Net.BCrypt.Verify(request.Password, existingUser.Password))
            return Error.Unauthorized("Email or password is incorrect.");

        await db.Users
            .Where(u => u.Id == existingUser.Id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(u => u.LastSeenAt, DateTime.UtcNow), ct);

        var payload = new TokenPayload(existingUser.Id, existingUser.Email);
        return await CreateSessionAndTokensAsync(payload, ipAddress, userAgent, ct);
    }

    public async Task<Result<TokensResponse>> RegisterAsync(
        RegisterRequest request,
        string? ipAddress,
        string? userAgent,
        CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var isExist = await db.Users.AnyAsync(u => u.Email == email, ct);
        if (isExist) return Error.Conflict("Email already exists.");

        var newUser = new UserEntity
        {
            Email = email,
            Name = request.Name.Trim(),
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            LastSeenAt = DateTime.UtcNow
        };

        var newAuth = new AuthEntity
        {
            Provider = "local",
            ProviderKey = email,
            User = newUser
        };

        db.Users.Add(newUser);
        db.Auths.Add(newAuth);

        var payload = new TokenPayload(newUser.Id, newUser.Email);
        return await CreateSessionAndTokensAsync(payload, ipAddress, userAgent, ct);
    }

    private async Task<TokensResponse> CreateSessionAndTokensAsync(
        TokenPayload payload, string? ipAddress, string? userAgent, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var expiresAt = now.AddDays(30);

        var session = new DeviceSession
        {
            UserId = payload.UserId,
            IpAddress = ipAddress,
            UserAgent = string.IsNullOrWhiteSpace(userAgent) ? null : userAgent[..Math.Min(userAgent.Length, 1024)],
            CreatedAt = now,
            LastUsedAt = now,
            ExpiresAt = expiresAt
        };

        var tokens = jwtService.GenerateTokens(payload, session.Id);

        var refreshToken = new RefreshToken
        {
            Session = session,
            TokenHash = tokens.TokenHash,
            ExpiresAt = expiresAt
        };

        db.DeviceSessions.Add(session);
        db.RefreshTokens.Add(refreshToken);
        await db.SaveChangesAsync(ct);

        return tokens;
    }
}