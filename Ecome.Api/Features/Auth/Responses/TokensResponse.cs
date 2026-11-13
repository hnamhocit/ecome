using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Features.Auth.Responses;

public record TokensResponse(
    [property: Required] string AccessToken,
    [property: Required] DateTime ExpiresAt,
    [property: Required] string RefreshToken,
    [property: Required] string TokenHash
);