using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Features.Auth.Dtos;

public record LoginRequest(
    [Required] [EmailAddress] string Email,
    [Required]
    [RegularExpression(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]
    string Password)
{
    public override string ToString()
    {
        return $"LoginRequest {{ Email = {Email} }}";
    }
}