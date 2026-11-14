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

        // 1. Upsert Permissions (updates Module & Description to English if already seeded)
        var existingPerms = await db.Permissions.ToDictionaryAsync(p => p.Code);

        foreach (var (code, module, desc) in Permissions.All)
            if (existingPerms.TryGetValue(code, out var perm))
            {
                perm.Module = module;
                perm.Description = desc;
            }
            else
            {
                perm = new Permission
                {
                    Code = code,
                    Module = module,
                    Description = desc
                };
                db.Permissions.Add(perm);
                existingPerms[code] = perm;
            }

        await db.SaveChangesAsync();

        // 2. Upsert System Roles (including Seller)
        var roleDefinitions = new (string Name, string Description, string[] DefaultPerms)[]
        {
            ("SuperAdmin", "Full system access and security configuration",
                Permissions.All.Select(p => p.Code).ToArray()),
            ("Admin", "Platform operations, seller review, and catalog oversight", [
                Permissions.CustomersView, Permissions.CustomersBan,
                Permissions.StaffManage,
                Permissions.SellersView, Permissions.SellersReview,
                Permissions.ProductsView, Permissions.ProductsManage,
                Permissions.OrdersView, Permissions.OrdersManage,
                Permissions.VouchersManage
            ]),
            ("Staff", "Order fulfillment and customer support", [
                Permissions.CustomersView,
                Permissions.SellersView,
                Permissions.ProductsView,
                Permissions.OrdersView, Permissions.OrdersManage
            ]),
            ("Seller", "Verified merchant managing own shop, products, and orders", [
                Permissions.ProductsViewSelf, Permissions.ProductsManageSelf,
                Permissions.OrdersViewSelf, Permissions.OrdersManageSelf,
                Permissions.VouchersManageSelf,
                Permissions.ShopManageSelf
            ]),
            ("Customer", "Standard storefront shopper", [])
        };

        var existingRoles = await db.Roles
            .Include(r => r.RolePermissions)
            .ToDictionaryAsync(r => r.Name, StringComparer.OrdinalIgnoreCase);

        foreach (var (name, desc, defaultPermCodes) in roleDefinitions)
            if (!existingRoles.TryGetValue(name, out var role))
            {
                role = new Role
                {
                    Name = name,
                    Description = desc,
                    IsSystem = true
                };
                db.Roles.Add(role);
                existingRoles[name] = role;

                foreach (var code in defaultPermCodes)
                    if (existingPerms.TryGetValue(code, out var perm))
                        db.RolePermissions.Add(new RolePermission { Role = role, Permission = perm });
            }
            else
            {
                // Update existing system role metadata to English
                role.Description = desc;
                role.IsSystem = true;

                // Ensure SuperAdmin always has all permissions, and system roles receive newly added default permissions
                var currentPermIds = role.RolePermissions.Select(rp => rp.PermissionId).ToHashSet();
                var targetCodes = name.Equals("SuperAdmin", StringComparison.OrdinalIgnoreCase)
                    ? Permissions.All.Select(p => p.Code)
                    : defaultPermCodes;

                foreach (var code in targetCodes)
                    if (existingPerms.TryGetValue(code, out var perm) && !currentPermIds.Contains(perm.Id))
                        db.RolePermissions.Add(new RolePermission { RoleId = role.Id, PermissionId = perm.Id });
            }

        await db.SaveChangesAsync();

        // 3. Assign SuperAdmin to the initial admin account if none exists
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