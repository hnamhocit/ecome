using Ecome.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecome.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Auth> Auths => Set<Auth>();
    public DbSet<DeviceSession> DeviceSessions => Set<DeviceSession>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        // Store email addresses and permission codes in a consistent form for lookups.
        foreach (var entry in ChangeTracker.Entries())
            if (entry.Entity is User user)
            {
                if (entry.State is EntityState.Added or EntityState.Modified)
                {
                    user.Email = user.Email.Trim().ToLowerInvariant();
                    if (entry.State == EntityState.Modified)
                        user.UpdatedAt = DateTime.UtcNow;
                }
            }
            else if (entry.Entity is Permission perm &&
                     entry.State is EntityState.Added or EntityState.Modified)
            {
                perm.Code = perm.Code.Trim().ToLowerInvariant();
            }

        return base.SaveChangesAsync(ct);
    }
}
