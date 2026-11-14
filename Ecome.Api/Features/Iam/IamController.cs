using Ecome.Api.Common.Auth;
using Ecome.Api.Common.Extensions;
using Ecome.Api.Features.Iam.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecome.Api.Features.Iam;

[ApiController]
[Route("admin/iam")]
[Authorize]
public class IamController(IamService iamService) : ControllerBase
{
    [HttpGet("permissions")]
    [HasPermission(Permissions.RolesManage)]
    public async Task<ActionResult<IReadOnlyList<PermissionItemResponse>>> GetPermissions(CancellationToken ct)
    {
        var result = await iamService.GetPermissionsAsync(ct);
        return result.ToActionResult(this);
    }

    [HttpGet("roles")]
    [HasPermission(Permissions.StaffManage)] // Cho phép Admin cũng xem được danh sách Role để gán cho nhân viên
    public async Task<ActionResult<IReadOnlyList<RoleItemResponse>>> GetRoles(CancellationToken ct)
    {
        var result = await iamService.GetRolesAsync(ct);
        return result.ToActionResult(this);
    }

    [HttpPost("roles")]
    [HasPermission(Permissions.RolesManage)]
    public async Task<ActionResult<RoleItemResponse>> CreateRole(
        [FromBody] CreateRoleRequest request,
        CancellationToken ct)
    {
        var result = await iamService.CreateRoleAsync(request, ct);
        return result.ToActionResult(this);
    }

    [HttpPut("roles/{id:guid}/permissions")]
    [HasPermission(Permissions.RolesManage)]
    public async Task<ActionResult<IReadOnlyList<string>>> UpdateRolePermissions(
        Guid id,
        [FromBody] UpdateRolePermissionsRequest request,
        CancellationToken ct)
    {
        var result = await iamService.UpdateRolePermissionsAsync(id, request.Permissions, ct);
        return result.ToActionResult(this);
    }
}