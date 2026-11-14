namespace Ecome.Api.Common.Utils;

public record ParsedUserAgent(
    string Browser,
    string Os,
    string DeviceType
);

public static class UserAgentParser
{
    public static ParsedUserAgent Parse(string? userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
        {
            return new ParsedUserAgent("Unknown", "Unknown", "Unknown");
        }

        var os = DetectOs(userAgent);
        var browser = DetectBrowser(userAgent);
        var deviceType = DetectDeviceType(userAgent, os);

        return new ParsedUserAgent(browser, os, deviceType);
    }

    private static string DetectDeviceType(string ua, string os)
    {
        // 1. Tablet check
        if (ua.Contains("iPad", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Tablet", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("PlayBook", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Silk", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Nexus 7", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Nexus 9", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Nexus 10", StringComparison.OrdinalIgnoreCase))
        {
            return "Tablet";
        }

        // 2. Mobile check
        if (ua.Contains("Mobi", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("iPhone", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("iPod", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Android", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("BlackBerry", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Windows Phone", StringComparison.OrdinalIgnoreCase))
        {
            return "Mobile";
        }

        // 3. Desktop check
        if (ua.Contains("Windows", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Macintosh", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Mac OS X", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Linux", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("CrOS", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("X11", StringComparison.OrdinalIgnoreCase))
        {
            return "Desktop";
        }

        return "Unknown";
    }

    private static string DetectOs(string ua)
    {
        if (ua.Contains("Windows NT 10.0", StringComparison.OrdinalIgnoreCase)) return "Windows 10/11";
        if (ua.Contains("Windows NT 6.3", StringComparison.OrdinalIgnoreCase)) return "Windows 8.1";
        if (ua.Contains("Windows NT 6.1", StringComparison.OrdinalIgnoreCase)) return "Windows 7";
        if (ua.Contains("Windows", StringComparison.OrdinalIgnoreCase)) return "Windows";
        if (ua.Contains("iPhone", StringComparison.OrdinalIgnoreCase)) return "iOS";
        if (ua.Contains("iPad", StringComparison.OrdinalIgnoreCase)) return "iPadOS";
        if (ua.Contains("Macintosh", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Mac OS X", StringComparison.OrdinalIgnoreCase)) return "macOS";
        if (ua.Contains("Android", StringComparison.OrdinalIgnoreCase)) return "Android";
        if (ua.Contains("CrOS", StringComparison.OrdinalIgnoreCase)) return "ChromeOS";
        if (ua.Contains("Linux", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("X11", StringComparison.OrdinalIgnoreCase)) return "Linux";

        return "Unknown";
    }

    private static string DetectBrowser(string ua)
    {
        if (ua.Contains("Edg/", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Edge/", StringComparison.OrdinalIgnoreCase)) return "Edge";
        if (ua.Contains("OPR/", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Opera", StringComparison.OrdinalIgnoreCase)) return "Opera";
        if (ua.Contains("Brave", StringComparison.OrdinalIgnoreCase)) return "Brave";
        if (ua.Contains("Vivaldi", StringComparison.OrdinalIgnoreCase)) return "Vivaldi";
        if (ua.Contains("SamsungBrowser", StringComparison.OrdinalIgnoreCase)) return "Samsung Internet";
        if (ua.Contains("UCBrowser", StringComparison.OrdinalIgnoreCase)) return "UC Browser";
        if (ua.Contains("Firefox", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("FxiOS", StringComparison.OrdinalIgnoreCase)) return "Firefox";
        if (ua.Contains("Chrome", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("CriOS", StringComparison.OrdinalIgnoreCase)) return "Chrome";
        if (ua.Contains("Safari", StringComparison.OrdinalIgnoreCase)) return "Safari";
        if (ua.Contains("MSIE", StringComparison.OrdinalIgnoreCase) ||
            ua.Contains("Trident/", StringComparison.OrdinalIgnoreCase)) return "Internet Explorer";

        return "Unknown";
    }
}
