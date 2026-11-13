using System.ComponentModel.DataAnnotations;

namespace Ecome.Api.Features.Auth.Responses;

public record AccessTokenResponse(
    [property: Required] string AccessToken,
    [property: Required] DateTime ExpiresAt
);