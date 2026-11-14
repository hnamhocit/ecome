using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Data.Entities;

public class DeviceSession
{
    public Guid Id { get; set; } = Guid.CreateVersion7();

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];

    [MaxLength(1024)]
    public string? UserAgent { get; set; }

    [MaxLength(45)]
    public string? IpAddress { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastUsedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(30);
    public DateTime? RevokedAt { get; set; }
}
