using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Features.Auth.Dtos;

public record RegisterRequest(
    [Required] [MaxLength(100)] string Name,
    [Required] [EmailAddress] string Email,
    [Required]
    [RegularExpression(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]
    string Password
)
{
    public override string ToString()
    {
        return $"RegisterRequest {{ Name = {Name}, Email = {Email} }}";
    }
}