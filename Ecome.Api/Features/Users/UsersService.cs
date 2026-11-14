using Ecome.Api.Common.Auth;
using Ecome.Api.Common.Results;
using Ecome.Api.Data;
using Ecome.Api.Data.Entities;
using Ecome.Api.Features.Users.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Ecome.Api.Features.Users;

public class UsersService(AppDbContext db, IamPermissionService iamService)
{
    public async Task<Result<PagedResponse<AdminUserItemResponse>>> GetUsersAsync(
        string? search,
        string? role,
        bool? isActive,
        int page = 1,
        int pageSize = 15,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Users.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var keyword = search.Trim().ToLower();
            query = query.Where(u =>
                u.Email.ToLower().Contains(keyword) ||
                u.Name.ToLower().Contains(keyword) ||
                (u.Phone != null && u.Phone.Contains(keyword)));
        }

        if (!string.IsNullOrWhiteSpace(role) && !role.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            if (role.Equals("internal", StringComparison.OrdinalIgnoreCase))
                // Filter all internal staff who have any role other than Customer
                query = query.Where(u => u.UserRoles.Any(ur => ur.Role.Name != "Customer"));
            else
                query = query.Where(u => u.UserRoles.Any(ur => ur.Role.Name == role));
        }

        if (isActive.HasValue) query = query.Where(u => u.IsActive == isActive.Value);

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new AdminUserItemResponse(
                u.Id,
                u.Email,
                u.Name,
                u.Phone,
                u.PhotoUrl,
                u.IsActive,
                u.CreatedAt,
                u.UserRoles.Select(ur => ur.Role.Name).ToList()
            ))
            .ToListAsync(ct);

        return new PagedResponse<AdminUserItemResponse>(items, totalCount, page, pageSize);
    }

    public async Task<Result<IReadOnlyList<string>>> UpdateUserRolesAsync(
        Guid actorId,
        Guid targetUserId,
        IReadOnlyList<string> roleNames,
        CancellationToken ct = default)
    {
        var user = await db.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == targetUserId, ct);

        if (user is null)
            return Error.NotFound("User not found.");

        var normalizedNames = roleNames
            .Where(r => !string.IsNullOrWhiteSpace(r))
            .Select(r => r.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        // Prevent self-demoting from SuperAdmin
        if (actorId == targetUserId &&
            user.UserRoles.Any(ur => ur.Role.Name == "SuperAdmin") &&
            !normalizedNames.Contains("SuperAdmin", StringComparer.OrdinalIgnoreCase))
            return Error.BadRequest("Cannot remove SuperAdmin role from your own account.");

        var validRoles = await db.Roles
            .Where(r => normalizedNames.Contains(r.Name))
            .ToListAsync(ct);

        if (validRoles.Count != normalizedNames.Count)
            return Error.BadRequest("Role list contains invalid role names.");

        db.UserRoles.RemoveRange(user.UserRoles);

        foreach (var role in validRoles)
            db.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id
            });

        await db.SaveChangesAsync(ct);
        await iamService.InvalidateUserAsync(user.Id, ct);

        return validRoles.Select(r => r.Name).ToList();
    }

    public async Task<Result<bool>> UpdateUserStatusAsync(
        Guid actorId,
        Guid targetUserId,
        bool isActive,
        CancellationToken ct = default)
    {
        if (actorId == targetUserId && !isActive)
            return Error.BadRequest("Cannot suspend your own account.");

        var user = await db.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == targetUserId, ct);

        if (user is null)
            return Error.NotFound("User not found.");

        if (!isActive && user.UserRoles.Any(ur => ur.Role.Name == "SuperAdmin"))
            return Error.BadRequest("Cannot suspend a SuperAdmin account.");

        user.IsActive = isActive;
        await db.SaveChangesAsync(ct);
        await iamService.InvalidateUserAsync(user.Id, ct);

        return user.IsActive;
    }
}
