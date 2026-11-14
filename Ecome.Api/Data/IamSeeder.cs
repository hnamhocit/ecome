using Ecome.Api.Common.Auth;
using Ecome.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecome.Api.Data;

public static class IamSeeder
{
    public static async Task SeedIamAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        // 1. Sync Permissions
        var existingPerms = await db.Permissions.ToDictionaryAsync(p => p.Code);
        var addedPerms = false;

        foreach (var (code, module, desc) in Permissions.All)
            if (!existingPerms.ContainsKey(code))
            {
                var perm = new Permission { Code = code, Module = module, Description = desc };
                db.Permissions.Add(perm);
                existingPerms[code] = perm;
                addedPerms = true;
            }

        if (addedPerms) await db.SaveChangesAsync();

        // 2. Sync System Roles
        var roleDefinitions = new (string Name, string Description, string[] DefaultPerms)[]
        {
            ("SuperAdmin", "Chủ hệ thống, toàn quyền quản trị", Permissions.All.Select(p => p.Code).ToArray()),
            ("Admin", "Quản lý vận hành cửa hàng", [
                Permissions.CustomersView, Permissions.CustomersBan,
                Permissions.StaffManage,
                Permissions.ProductsView, Permissions.ProductsManage,
                Permissions.OrdersView, Permissions.OrdersManage,
                Permissions.VouchersManage
            ]),
            ("Staff", "Nhân viên xử lý đơn hàng và CSKH", [
                Permissions.CustomersView,
                Permissions.ProductsView, Permissions.ProductsManage,
                Permissions.OrdersView, Permissions.OrdersManage
            ]),
            ("Customer", "Khách hàng mua sắm", [])
        };

        var existingRoles = await db.Roles
            .Include(r => r.RolePermissions)
            .ToDictionaryAsync(r => r.Name, StringComparer.OrdinalIgnoreCase);

        foreach (var (name, desc, defaultPermCodes) in roleDefinitions)
            if (!existingRoles.TryGetValue(name, out var role))
            {
                role = new Role { Name = name, Description = desc, IsSystem = true };
                db.Roles.Add(role);
                existingRoles[name] = role;

                foreach (var code in defaultPermCodes)
                    if (existingPerms.TryGetValue(code, out var perm))
                        db.RolePermissions.Add(new RolePermission { Role = role, Permission = perm });
            }
            else if (name.Equals("SuperAdmin", StringComparison.OrdinalIgnoreCase))
            {
                // Đảm bảo SuperAdmin luôn tự động nhận các quyền mới thêm về sau
                var currentPermIds = role.RolePermissions.Select(rp => rp.PermissionId).ToHashSet();
                foreach (var perm in existingPerms.Values.Where(p => !currentPermIds.Contains(p.Id)))
                    db.RolePermissions.Add(new RolePermission { RoleId = role.Id, PermissionId = perm.Id });
            }

        await db.SaveChangesAsync();

        // 3. Gán SuperAdmin cho tài khoản quản trị đầu tiên
        var superAdminRole = existingRoles["SuperAdmin"];
        var hasSuperAdmin = await db.UserRoles.AnyAsync(ur => ur.RoleId == superAdminRole.Id);
        if (!hasSuperAdmin)
        {
            var targetEmail = config["Iam:SuperAdminEmail"];
            var targetUser = !string.IsNullOrWhiteSpace(targetEmail)
                ? await db.Users.FirstOrDefaultAsync(u => u.Email == targetEmail)
                : await db.Users.OrderBy(u => u.CreatedAt).FirstOrDefaultAsync();

            if (targetUser is not null)
            {
                db.UserRoles.Add(new UserRole { UserId = targetUser.Id, RoleId = superAdminRole.Id });
                await db.SaveChangesAsync();
            }
        }
    }
}