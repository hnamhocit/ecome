using System.Security.Claims;
using Ecome.Api.Common.Extensions;
using Ecome.Api.Common.Results;
using Ecome.Api.Features.Auth.Dtos;
using Ecome.Api.Features.Auth.Responses;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Ecome.Api.Features.Auth;

[ApiController]
[Route("auth")]
public class AuthController(
    AuthService authService,
    IWebHostEnvironment env,
    IConfiguration configuration) : ControllerBase
{
    private static readonly Dictionary<string, string> SupportedProviders = new(StringComparer.OrdinalIgnoreCase)
    {
        ["google"] = "Google",
        ["github"] = "GitHub",
        ["facebook"] = "Facebook"
    };

    [HttpGet("{provider:regex(^(google|github|facebook)$)}")]
    public IActionResult ExternalLogin([FromRoute] string provider, [FromQuery] string? returnUrl = null)
    {
        var scheme = SupportedProviders[provider];
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(ExternalLoginCallback), new { returnUrl })
        };

        return Challenge(properties, scheme);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> ExternalLoginCallback(
        [FromQuery] string? returnUrl,
        CancellationToken ct)
    {
        var authResult = await HttpContext.AuthenticateAsync(AuthExtensions.ExternalCookieScheme);
        await HttpContext.SignOutAsync(AuthExtensions.ExternalCookieScheme);

        if (!authResult.Succeeded || authResult.Principal is null)
            return RedirectToFrontendCallback("external_auth_failed", returnUrl);

        var principal = authResult.Principal;
        var provider = authResult.Properties?.Items[".AuthScheme"] ?? "unknown";
        var providerKey = principal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(providerKey))
            return RedirectToFrontendCallback("missing_provider_id", returnUrl);

        var email = principal.FindFirstValue(ClaimTypes.Email);
        var name = principal.FindFirstValue(ClaimTypes.Name);
        var (ipAddress, userAgent) = ExtractClientInfo();

        var result = await authService.ExternalLoginAsync(
            provider, providerKey, email, name, ipAddress, userAgent, ct);

        if (result.Error is not null || result.Value is null)
            return RedirectToFrontendCallback("oauth_login_failed", returnUrl);

        SetRefreshTokenCookie(result.Value.RefreshToken);
        return RedirectToFrontendCallback(null, returnUrl);
    }

    [EnableRateLimiting("refresh-limit")]
    [HttpPost("refresh")]
    public async Task<ActionResult<AccessTokenResponse>> Refresh(CancellationToken ct)
    {
        var refreshToken = Request.Cookies["refresh_token"];
        var (ipAddress, _) = ExtractClientInfo();

        var result = await authService.RefreshTokenAsync(refreshToken, ipAddress, ct);

        if (result.Error is not null)
            RemoveRefreshTokenCookie();

        return ToAuthActionResult(result);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout(CancellationToken ct)
    {
        var result = await authService.LogoutAsync(User.GetUserId(), User.GetSessionId(), ct);

        return result.ToActionResult(this, _ =>
        {
            RemoveRefreshTokenCookie();
            return new { message = "Logged out successfully." };
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AccessTokenResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken ct)
    {
        var (ipAddress, userAgent) = ExtractClientInfo();
        var result = await authService.LoginAsync(request, ipAddress, userAgent, ct);

        return ToAuthActionResult(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult<AccessTokenResponse>> Register(
        [FromBody] RegisterRequest request,
        CancellationToken ct)
    {
        var (ipAddress, userAgent) = ExtractClientInfo();
        var result = await authService.RegisterAsync(request, ipAddress, userAgent, ct);

        return ToAuthActionResult(result);
    }

    private ActionResult<AccessTokenResponse> ToAuthActionResult(Result<TokensResponse> result)
    {
        return result.ToActionResult(this, tokens =>
        {
            SetRefreshTokenCookie(tokens.RefreshToken);
            return new AccessTokenResponse(tokens.AccessToken, tokens.ExpiresAt);
        });
    }

    private RedirectResult RedirectToFrontendCallback(string? error, string? returnUrl)
    {
        var baseUrl = configuration["Authentication:FrontendCallbackUrl"]
                      ?? "http://localhost:3000/auth/callback";

        var queryParams = new List<string>(2);
        if (!string.IsNullOrWhiteSpace(error))
            queryParams.Add($"error={Uri.EscapeDataString(error)}");
        if (!string.IsNullOrWhiteSpace(returnUrl))
            queryParams.Add($"returnUrl={Uri.EscapeDataString(returnUrl)}");

        var url = queryParams.Count > 0 ? $"{baseUrl}?{string.Join('&', queryParams)}" : baseUrl;
        return Redirect(url);
    }

    private (string? IpAddress, string? UserAgent) ExtractClientInfo()
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.FirstOrDefault();
        return (ipAddress, userAgent);
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var options = BuildRefreshTokenCookieOptions();
        options.Expires = DateTimeOffset.UtcNow.AddDays(30);

        Response.Cookies.Append("refresh_token", refreshToken, options);
    }

    private void RemoveRefreshTokenCookie()
    {
        Response.Cookies.Delete("refresh_token", BuildRefreshTokenCookieOptions());
    }

    private CookieOptions BuildRefreshTokenCookieOptions()
    {
        var isDev = env.IsDevelopment();

        return new CookieOptions
        {
            HttpOnly = true,
            IsEssential = true,
            Secure = !isDev,
            SameSite = isDev ? SameSiteMode.Lax : SameSiteMode.None,
            Path = "/auth"
        };
    }
}