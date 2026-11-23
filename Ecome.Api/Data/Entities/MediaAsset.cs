using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Data.Entities;

public enum MediaStatus
{
    Pending,
    Attached
}

public class MediaAsset
{
    public Guid Id { get; set; } = Guid.CreateVersion7();

    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    [MaxLength(63)] public string Bucket { get; set; } = string.Empty;

    [MaxLength(512)] public string ObjectKey { get; set; } = string.Empty;

    [MaxLength(100)] public string ContentType { get; set; } = string.Empty;

    public long Size { get; set; }

    public MediaStatus Status { get; set; } = MediaStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
