using Ecome.Api.Common.Extensions;
using Ecome.Api.Common.Results;
using Ecome.Api.Features.Me.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecome.Api.Features.Me;

[ApiController]
[Route("me")]
[Authorize]
public class MeController(MeService meService) : ControllerBase
{
    [HttpGet("")]
    public async Task<ActionResult<MeResponse>> GetMe(CancellationToken ct)
    {
        var result = await meService.GetMeAsync(User.GetUserId(), ct);
        return result.ToActionResult(this);
    }

    [HttpGet("sessions")]
    public async Task<ActionResult<List<UserSessionItemResponse>>> GetSessions(CancellationToken ct)
    {
        var refreshToken = Request.Cookies["refresh_token"];
        var result = await meService.GetSessionsAsync(
            User.GetUserId(),
            refreshToken,
            User.GetSessionId(),
            ct);

        return result.ToActionResult(this);
    }

    [HttpDelete("sessions/others")]
    public async Task<ActionResult<RevokeOthersResponse>> RevokeOtherSessions(CancellationToken ct)
    {
        var refreshToken = Request.Cookies["refresh_token"];
        var result = await meService.RevokeOtherSessionsAsync(
            User.GetUserId(),
            refreshToken,
            User.GetSessionId(),
            ct);

        return result.ToActionResult(this);
    }

    [HttpDelete("sessions/{id:guid}")]
    public async Task<ActionResult<string>> RevokeSession(Guid id, CancellationToken ct)
    {
        var refreshToken = Request.Cookies["refresh_token"];
        var result = await meService.RevokeSessionAsync(
            User.GetUserId(),
            id,
            refreshToken,
            User.GetSessionId(),
            ct);

        return result.ToActionResult(this, _ => new { message = "Session revoked successfully." });
    }
}
