using Ecome.Api.Common.Auth;
using Ecome.Api.Common.Extensions;
using Ecome.Api.Features.Users.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecome.Api.Features.Users;

[ApiController]
[Route("users")]
[Authorize]
public class UsersController(UsersService usersService) : ControllerBase
{
    [HttpGet]
    [HasPermission(Permissions.CustomersView)]
    public async Task<ActionResult<PagedResponse<AdminUserItemResponse>>> GetUsers(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] bool? isActive,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 15,
        CancellationToken ct = default)
    {
        var result = await usersService.GetUsersAsync(search, role, isActive, page, pageSize, ct);
        return result.ToActionResult(this);
    }

    [HttpPut("{id:guid}/roles")]
    [HasPermission(Permissions.StaffManage)]
    public async Task<ActionResult<IReadOnlyList<string>>> UpdateUserRoles(
        Guid id,
        [FromBody] UpdateUserRolesRequest request,
        CancellationToken ct)
    {
        var result = await usersService.UpdateUserRolesAsync(User.GetUserId(), id, request.Roles, ct);
        return result.ToActionResult(this);
    }

    [HttpPatch("{id:guid}/status")]
    [HasPermission(Permissions.CustomersBan)]
    public async Task<ActionResult<bool>> UpdateUserStatus(
        Guid id,
        [FromBody] UpdateUserStatusRequest request,
        CancellationToken ct)
    {
        var result = await usersService.UpdateUserStatusAsync(User.GetUserId(), id, request.IsActive, ct);
        return result.ToActionResult(this);
    }
}