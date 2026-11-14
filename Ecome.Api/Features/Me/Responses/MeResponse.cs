namespace Ecome.Api.Features.Me.Responses;

public record MeResponse(
    Guid Id,
    string Email,
    string Name,
    string? Phone,
    string? PhotoUrl,
    string? BackgroundUrl,
    string? Bio,
    DateTime CreatedAt,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions
);