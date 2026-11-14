using Ecome.Api.Common.Extensions;
using Ecome.Api.Common.Middleware;
using Ecome.Api.Data;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

var port = builder.Configuration.GetValue("Port", 8080);
builder.WebHost.UseUrls($"http://*:{port}");

builder.AddObservability();
builder.Services
    .AddInfrastructure(builder.Configuration)
    .AddAuthFeature(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => options.WithTitle("Ecommerce API Reference"));
}

app.UseCors("AllowFrontend");

app.UseSerilogRequestLogging(options =>
{
    options.MessageTemplate = "[{StatusCode}] {RequestMethod} {RequestPath} ({Elapsed:0.0} ms)";

    options.GetLevel = (httpContext, elapsed, ex) =>
    {
        if (ex != null || httpContext.Response.StatusCode >= 500)
            return LogEventLevel.Error;

        if (httpContext.Response.StatusCode >= 400)
            return LogEventLevel.Warning;

        return LogEventLevel.Information;
    };
});

app.UseExceptionHandler();
app.UseMiddleware<RequestResponseLoggingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();

app.MapControllers();

app.MapHealthChecks("/healthz/live", new HealthCheckOptions { Predicate = _ => false });
app.MapHealthChecks("/healthz/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

await app.SeedIamAsync();

app.Run();