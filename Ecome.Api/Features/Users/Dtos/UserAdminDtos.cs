namespace Ecome.Api.Features.Users.Dtos;

public record AdminUserItemResponse(
    Guid Id,
    string Email,
    string Name,
    string? Phone,
    string? PhotoUrl,
    bool IsActive,
    DateTime CreatedAt,
    IReadOnlyList<string> Roles
);

public record PagedResponse<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize
);

public record UpdateUserRolesRequest(IReadOnlyList<string> Roles);

public record UpdateUserStatusRequest(bool IsActive);