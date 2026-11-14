using System.Text.Json;
using Ecome.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace Ecome.Api.Common.Auth;

public record UserAccessData(IReadOnlyList<string> Roles, IReadOnlyList<string> Permissions);

public class IamPermissionService(AppDbContext db, IDistributedCache cache)
{
    private static readonly DistributedCacheEntryOptions CacheOptions = new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
    };

    private static string GetCacheKey(Guid userId)
    {
        return $"iam:user:{userId}";
    }

    public async Task<UserAccessData> GetUserAccessAsync(Guid userId, CancellationToken ct = default)
    {
        var key = GetCacheKey(userId);
        var cachedJson = await cache.GetStringAsync(key, ct);
        if (!string.IsNullOrEmpty(cachedJson))
        {
            var cached = JsonSerializer.Deserialize<UserAccessData>(cachedJson);
            if (cached is not null) return cached;
        }

        var roles = await db.UserRoles
            .AsNoTracking()
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.Role.Name)
            .ToListAsync(ct);

        List<string> permissions;
        if (roles.Contains("SuperAdmin", StringComparer.OrdinalIgnoreCase))
            permissions = await db.Permissions
                .AsNoTracking()
                .Select(p => p.Code)
                .ToListAsync(ct);
        else
            permissions = await db.UserRoles
                .AsNoTracking()
                .Where(ur => ur.UserId == userId)
                .SelectMany(ur => ur.Role.RolePermissions)
                .Select(rp => rp.Permission.Code)
                .Distinct()
                .ToListAsync(ct);

        var access = new UserAccessData(roles, permissions);
        await cache.SetStringAsync(key, JsonSerializer.Serialize(access), CacheOptions, ct);
        return access;
    }

    public Task InvalidateUserAsync(Guid userId, CancellationToken ct = default)
    {
        return cache.RemoveAsync(GetCacheKey(userId), ct);
    }

    public async Task InvalidateRoleUsersAsync(Guid roleId, CancellationToken ct = default)
    {
        var userIds = await db.UserRoles
            .AsNoTracking()
            .Where(ur => ur.RoleId == roleId)
            .Select(ur => ur.UserId)
            .ToListAsync(ct);

        foreach (var uid in userIds)
            await cache.RemoveAsync(GetCacheKey(uid), ct);
    }
}