using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.RegularExpressions;
using Serilog;

namespace Ecome.Api.Common.Middleware;

public partial class RequestResponseLoggingMiddleware(RequestDelegate next)
{
    private const int MaxBodyLength = 4096;

    private static readonly HashSet<string> SensitiveKeys = new(StringComparer.OrdinalIgnoreCase)
    {
        "password", "confirmPassword", "currentPassword", "newPassword",
        "token", "accessToken", "refreshToken", "secret"
    };

    public async Task InvokeAsync(HttpContext context, IDiagnosticContext diagnosticContext)
    {
        var path = context.Request.Path.Value ?? string.Empty;
        if (path.StartsWith("/scalar", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/openapi", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/healthz", StringComparison.OrdinalIgnoreCase))
        {
            await next(context);
            return;
        }

        // 1. Format JSON và che trường nhạy cảm cho RequestBody
        if (!HttpMethods.IsGet(context.Request.Method) && !HttpMethods.IsDelete(context.Request.Method))
        {
            var requestBody = await ReadRequestBodyAsync(context.Request);
            if (!string.IsNullOrWhiteSpace(requestBody))
                diagnosticContext.Set("RequestBody", FormatJson(requestBody, true));
        }

        var originalBodyStream = context.Response.Body;
        await using var responseBodyStream = new MemoryStream();
        context.Response.Body = responseBodyStream;

        try
        {
            await next(context);

            // 2. Format JSON thụt lề cho ResponseBody (không mask để giữ nguyên nội dung lỗi)
            if (context.Response.StatusCode >= 400 && IsLoggableContentType(context.Response.ContentType))
            {
                responseBodyStream.Position = 0;
                var responseBody = await new StreamReader(responseBodyStream, Encoding.UTF8).ReadToEndAsync();
                if (!string.IsNullOrWhiteSpace(responseBody))
                    diagnosticContext.Set("ResponseBody", FormatJson(responseBody, false));
            }

            responseBodyStream.Position = 0;
            await responseBodyStream.CopyToAsync(originalBodyStream);
        }
        finally
        {
            context.Response.Body = originalBodyStream;
        }
    }

    private static string FormatJson(string rawBody, bool maskSensitive)
    {
        try
        {
            using var doc = JsonDocument.Parse(rawBody);
            using var stream = new MemoryStream();
            using (var writer = new Utf8JsonWriter(stream, new JsonWriterOptions
                   {
                       Indented = true,
                       Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                   }))
            {
                WriteElement(writer, doc.RootElement, maskSensitive);
            }

            return Truncate(Encoding.UTF8.GetString(stream.ToArray()));
        }
        catch (JsonException)
        {
            var text = maskSensitive ? MaskSensitiveData(rawBody) : rawBody;
            return Truncate(text);
        }
    }

    private static void WriteElement(Utf8JsonWriter writer, JsonElement element, bool maskSensitive)
    {
        switch (element.ValueKind)
        {
            case JsonValueKind.Object:
                writer.WriteStartObject();
                foreach (var prop in element.EnumerateObject())
                {
                    writer.WritePropertyName(prop.Name);
                    if (maskSensitive && SensitiveKeys.Contains(prop.Name))
                        writer.WriteStringValue("***");
                    else
                        WriteElement(writer, prop.Value, maskSensitive);
                }

                writer.WriteEndObject();
                break;

            case JsonValueKind.Array:
                writer.WriteStartArray();
                foreach (var item in element.EnumerateArray()) WriteElement(writer, item, maskSensitive);
                writer.WriteEndArray();
                break;

            default:
                element.WriteTo(writer);
                break;
        }
    }

    private static async Task<string> ReadRequestBodyAsync(HttpRequest request)
    {
        if (!IsLoggableContentType(request.ContentType))
            return string.Empty;

        request.EnableBuffering();

        using var reader = new StreamReader(
            request.Body,
            Encoding.UTF8,
            false,
            leaveOpen: true);

        var body = await reader.ReadToEndAsync();
        request.Body.Position = 0;
        return body;
    }

    private static bool IsLoggableContentType(string? contentType)
    {
        if (string.IsNullOrWhiteSpace(contentType))
            return false;

        return contentType.Contains("application/json", StringComparison.OrdinalIgnoreCase)
               || contentType.Contains("application/problem+json", StringComparison.OrdinalIgnoreCase)
               || contentType.Contains("text/", StringComparison.OrdinalIgnoreCase)
               || contentType.Contains("application/x-www-form-urlencoded", StringComparison.OrdinalIgnoreCase);
    }

    private static string Truncate(string value)
    {
        return value.Length <= MaxBodyLength ? value : $"{value[..MaxBodyLength]}...[TRUNCATED]";
    }

    private static string MaskSensitiveData(string body)
    {
        return SensitiveFieldsRegex().Replace(body, "$1***$2");
    }

    [GeneratedRegex(
        @"(""(?:password|confirmPassword|currentPassword|newPassword|token|accessToken|refreshToken|secret)""\s*:\s*"")[^""]*("")",
        RegexOptions.IgnoreCase)]
    private static partial Regex SensitiveFieldsRegex();
}