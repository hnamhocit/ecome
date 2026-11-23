using Ecome.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ecome.Api.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Email).IsUnique();
    }
}

public class AuthConfiguration : IEntityTypeConfiguration<Auth>
{
    public void Configure(EntityTypeBuilder<Auth> builder)
    {
        builder.HasKey(a => new { a.Provider, a.ProviderKey });
    }
}

public class DeviceSessionConfiguration : IEntityTypeConfiguration<DeviceSession>
{
    public void Configure(EntityTypeBuilder<DeviceSession> builder)
    {
        // Support listing non-revoked sessions by user and last activity.
        builder.HasIndex(s => new { s.UserId, s.LastUsedAt })
            .HasFilter("\"RevokedAt\" IS NULL");

        // Support lookups of expired sessions.
        builder.HasIndex(s => s.ExpiresAt);
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.HasIndex(t => t.TokenHash).IsUnique();
    }
}

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        // Prevent deletion of roles that are still assigned to users.
        builder.HasMany(r => r.UserRoles)
            .WithOne(ur => ur.Role)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class MediaAssetConfiguration : IEntityTypeConfiguration<MediaAsset>
{
    public void Configure(EntityTypeBuilder<MediaAsset> builder)
    {
        // Allow only one record per object storage key within a bucket.
        builder.HasIndex(m => new { m.Bucket, m.ObjectKey }).IsUnique();

        // Support cleanup queries that filter by status and creation time.
        builder.HasIndex(m => new { m.Status, m.CreatedAt });

        // Store readable status names in PostgreSQL.
        builder.Property(m => m.Status).HasConversion<string>().HasMaxLength(32);

        // Preserve the owner reference while stored objects still exist.
        builder.HasOne(m => m.Owner)
            .WithMany()
            .HasForeignKey(m => m.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
