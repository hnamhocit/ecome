using Ecome.Api.Common.Extensions;
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
}