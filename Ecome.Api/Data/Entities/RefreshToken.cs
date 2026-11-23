using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Data.Entities;

public class RefreshToken
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid SessionId { get; set; }
    public DeviceSession Session { get; set; } = null!;
    
    [MaxLength(2048)]
    public string TokenHash { get; set; } = "";    // SHA256, NEVER store raw tokens
    
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UsedAt { get; set; }          // != null indicates token has been rotated
    public Guid? ReplacedById { get; set; }
}