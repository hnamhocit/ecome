using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Data.Entities;

public class DeviceSession
{
    public Guid Id { get; set; } = Guid.CreateVersion7();

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    private ICollection<RefreshToken> RefreshTokens { get; set; } = [];

    [MaxLength(100)] public string DeviceName { get; set; } = ""; // User-Agent, parse sau bằng UAParser

    [MaxLength(100)] public string? Ip { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastSeenAt { get; set; } = DateTime.UtcNow;
    public DateTime? RevokedAt { get; set; }
}