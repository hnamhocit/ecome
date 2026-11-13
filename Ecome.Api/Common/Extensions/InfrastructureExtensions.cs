using System.Threading.RateLimiting;
using Ecome.Api.Common.Exceptions;
using Ecome.Api.Data;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;

namespace Ecome.Api.Common.Extensions;

public static class InfrastructureExtensions
{
    public static WebApplicationBuilder AddObservability(this WebApplicationBuilder builder)
    {
        var seqUrl = builder.Configuration["Seq:ServerUrl"] ?? "http://localhost:5341";

        builder.Host.UseSerilog((_, config) =>
        {
            config
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.Async(a => a.Seq(seqUrl));
        });

        return builder;
    }

    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var pgConn = configuration.GetConnectionString("PostgreSQL")
                     ?? throw new InvalidOperationException("Missing ConnectionStrings:PostgreSQL");

        var redisConn = configuration.GetConnectionString("Redis")
                        ?? throw new InvalidOperationException("Missing ConnectionStrings:Redis");

        services.AddDbContext<AppDbContext>(options => options.UseNpgsql(pgConn));

        services.AddHealthChecks()
            .AddNpgSql(pgConn, name: "postgresql", tags: ["db", "ready"])
            .AddRedis(redisConn, "redis", tags: ["cache", "ready"]);

        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                             ?? ["http://localhost:3000", "http://localhost:5173"];

        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.AddPolicy("refresh-limit", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 5,
                        Window = TimeSpan.FromMinutes(1),
                        QueueLimit = 0
                    }));
        });

        return services;
    }
}