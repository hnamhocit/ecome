using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Data.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.CreateVersion7();

    [MaxLength(255)] public string Email { get; set; } = "";

    [MaxLength(100)] public string Name { get; set; } = "";

    [MaxLength(2048)] public string? Password { get; set; } = "";

    [MaxLength(20)] public string? Phone { get; set; }

    [MaxLength(255)] public string? PhotoUrl { get; set; }

    [MaxLength(255)] public string? BackgroundUrl { get; set; }

    [MaxLength(255)] public string? Bio { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<UserRole> UserRoles { get; set; } = [];

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastSeenAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}