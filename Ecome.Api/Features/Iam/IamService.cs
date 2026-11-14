using Ecome.Api.Common.Auth;
using Ecome.Api.Common.Results;
using Ecome.Api.Data;
using Ecome.Api.Data.Entities;
using Ecome.Api.Features.Iam.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Ecome.Api.Features.Iam;

public class IamService(AppDbContext db, IamPermissionService permissionCache)
{
    public async Task<Result<IReadOnlyList<PermissionItemResponse>>> GetPermissionsAsync(CancellationToken ct = default)
    {
        var list = await db.Permissions
            .AsNoTracking()
            .OrderBy(p => p.Module)
            .ThenBy(p => p.Code)
            .Select(p => new PermissionItemResponse(p.Id, p.Code, p.Module, p.Description))
            .ToListAsync(ct);

        return list;
    }

    public async Task<Result<IReadOnlyList<RoleItemResponse>>> GetRolesAsync(CancellationToken ct = default)
    {
        var roles = await db.Roles
            .AsNoTracking()
            .OrderByDescending(r => r.IsSystem)
            .ThenBy(r => r.Name)
            .Select(r => new RoleItemResponse(
                r.Id,
                r.Name,
                r.Description,
                r.IsSystem,
                r.UserRoles.Count,
                r.RolePermissions.Select(rp => rp.Permission.Code).ToList()
            ))
            .ToListAsync(ct);

        return roles;
    }

    public async Task<Result<RoleItemResponse>> CreateRoleAsync(CreateRoleRequest request,
        CancellationToken ct = default)
    {
        var name = request.Name.Trim();
        if (string.IsNullOrWhiteSpace(name))
            return Error.BadRequest("Tên vai trò không được để trống.");

        var exists = await db.Roles.AnyAsync(r => r.Name.ToLower() == name.ToLower(), ct);
        if (exists)
            return Error.Conflict($"Vai trò '{name}' đã tồn tại.");

        var role = new Role
        {
            Name = name,
            Description = request.Description?.Trim(),
            IsSystem = false
        };

        db.Roles.Add(role);
        await db.SaveChangesAsync(ct);

        return new RoleItemResponse(role.Id, role.Name, role.Description, role.IsSystem, 0, []);
    }

    public async Task<Result<IReadOnlyList<string>>> UpdateRolePermissionsAsync(
        Guid roleId,
        IReadOnlyList<string> permissionCodes,
        CancellationToken ct = default)
    {
        var role = await db.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == roleId, ct);

        if (role is null)
            return Error.NotFound("Không tìm thấy vai trò.");

        if (role.Name.Equals("SuperAdmin", StringComparison.OrdinalIgnoreCase))
            return Error.BadRequest("Không thể chỉnh sửa quyền của SuperAdmin.");

        var normalizedCodes = permissionCodes
            .Where(c => !string.IsNullOrWhiteSpace(c))
            .Select(c => c.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var permissions = await db.Permissions
            .Where(p => normalizedCodes.Contains(p.Code))
            .ToListAsync(ct);

        db.RolePermissions.RemoveRange(role.RolePermissions);

        foreach (var perm in permissions)
            db.RolePermissions.Add(new RolePermission
            {
                RoleId = role.Id,
                PermissionId = perm.Id
            });

        await db.SaveChangesAsync(ct);
        await permissionCache.InvalidateRoleUsersAsync(role.Id, ct);

        return permissions.Select(p => p.Code).ToList();
    }
}