using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Features.Auth.Dtos;

public record TokenPayload(
    [Required] Guid UserId,
    [Required] [MaxLength(255)] string Email
);