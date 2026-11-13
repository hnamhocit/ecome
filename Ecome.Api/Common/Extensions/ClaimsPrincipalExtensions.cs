using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Ecome.Api.Common.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var sub = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(sub, out var userId) ? userId : Guid.Empty;
    }

    public static Guid GetSessionId(this ClaimsPrincipal principal)
    {
        var sid = principal.FindFirstValue("sid");
        return Guid.TryParse(sid, out var sessionId) ? sessionId : Guid.Empty;
    }
}