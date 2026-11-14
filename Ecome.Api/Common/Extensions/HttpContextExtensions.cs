namespace Ecome.Api.Common.Extensions;

public static class HttpContextExtensions
{
    public static string? GetClientIpAddress(this HttpContext context)
    {
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(forwardedFor))
        {
            var firstIp = forwardedFor
                .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
                .FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(firstIp))
                return firstIp;
        }

        var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(realIp))
            return realIp.Trim();

        return context.Connection.RemoteIpAddress?.ToString();
    }

    public static string? GetClientUserAgent(this HttpContext context)
    {
        return context.Request.Headers.UserAgent.FirstOrDefault()
            ?? context.Request.Headers["User-Agent"].FirstOrDefault();
    }
}
