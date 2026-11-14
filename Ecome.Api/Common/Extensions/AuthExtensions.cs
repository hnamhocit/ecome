using System.Text;
using Ecome.Api.Common.Auth;
using Ecome.Api.Features.Auth;
using Ecome.Api.Features.Iam;
using Ecome.Api.Features.Me;
using Ecome.Api.Features.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace Ecome.Api.Common.Extensions;

public static class AuthExtensions
{
    public const string ExternalCookieScheme = "ExternalCookie";

    public static IServiceCollection AddAuthFeature(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtSecret = configuration["Jwt:Secret"]
                        ?? throw new InvalidOperationException("Missing Jwt:Secret configuration.");

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = ExternalCookieScheme;
            })
            .AddCookie(ExternalCookieScheme, options =>
            {
                options.Cookie.Name = "ecome.external";
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite =
                    SameSiteMode.Lax; // Bắt buộc Lax để giữ state khi redirect từ OAuth provider về
                options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
            })
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = configuration["Jwt:Issuer"],

                    ValidateAudience = true,
                    ValidAudience = configuration["Jwt:Audience"],

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            })
            .AddGoogle(options =>
            {
                options.ClientId = configuration["Authentication:Google:ClientId"]!;
                options.ClientSecret = configuration["Authentication:Google:ClientSecret"]!;
                options.CallbackPath = "/signin-google";
            })
            .AddGitHub(options =>
            {
                options.ClientId = configuration["Authentication:GitHub:ClientId"]!;
                options.ClientSecret = configuration["Authentication:GitHub:ClientSecret"]!;
                options.CallbackPath = "/signin-github";
                options.Scope.Add("user:email"); // Lấy cả email nếu user để chế độ private trên GitHub
            })
            .AddFacebook(options =>
            {
                options.AppId = configuration["Authentication:Facebook:AppId"]!;
                options.AppSecret = configuration["Authentication:Facebook:AppSecret"]!;
                options.CallbackPath = "/signin-facebook";
            });

        services.AddAuthorization();
        services.AddSingleton<JwtService>();
        services.AddScoped<AuthService>();
        services.AddScoped<MeService>();
        services.AddScoped<UsersService>();
        services.AddScoped<UsersService>();
        services.AddScoped<IamService>();
        services.AddScoped<IamPermissionService>();
        services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

        return services;
    }
}