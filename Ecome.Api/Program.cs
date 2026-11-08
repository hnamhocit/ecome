using Scalar.AspNetCore;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

var port = builder.Configuration.GetValue<int>("Port", 8080);
builder.WebHost.UseUrls($"http://*:{port}");

var pgConn = builder.Configuration.GetConnectionString("PostgreSQL");
var redisConn = builder.Configuration.GetConnectionString("Redis");

builder.Services.AddHealthChecks()
    .AddNpgSql(pgConn!, name: "postgresql", tags: ["db", "ready"])
    .AddRedis(redisConn!, name: "redis", tags: ["cache", "ready"]);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowFrontend", policy =>
  {
    policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
  });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();

  app.MapScalarApiReference(options =>
  {
    options.WithTitle("Ecommerce API Reference");
  });
}

app.UseCors("AllowFrontend");

app.MapHealthChecks("/healthz/live", new HealthCheckOptions
{
  Predicate = _ => false
});

app.MapHealthChecks("/healthz/ready", new HealthCheckOptions
{
  Predicate = check => check.Tags.Contains("ready"),
  ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.Run();
