namespace Ecome.Api.Features.Iam.Dtos;

public record PermissionItemResponse(
    Guid Id,
    string Code,
    string Module,
    string? Description
);

public record RoleItemResponse(
    Guid Id,
    string Name,
    string? Description,
    bool IsSystem,
    int UserCount,
    IReadOnlyList<string> Permissions
);

public record CreateRoleRequest(string Name, string? Description);

public record UpdateRolePermissionsRequest(IReadOnlyList<string> Permissions);