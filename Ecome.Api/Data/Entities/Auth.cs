using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Data.Entities;

public class Auth
{
    [MaxLength(50)]
    public string Provider { get; set; } = "";      // google | github | facebook

    [MaxLength(255)]
    public string ProviderKey { get; set; } = "";   // Google sub dài 21 ký tự, OIDC có thể tới 255

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
