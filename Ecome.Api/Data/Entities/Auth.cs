using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Data.Entities;

public class Auth 
{
    [MaxLength(20)]
    public string Provider { get; set; } = "";     // google | github | facebook
    
    [MaxLength(20)]
    public string ProviderKey { get; set; } = "";  // id bên provider
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}