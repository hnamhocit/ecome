using System.Security.Cryptography;
using System.Text;
using Ecome.Api.Features.Auth.Dtos;
using Ecome.Api.Features.Auth.Responses;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Ecome.Api.Features.Auth;

public class JwtService(IConfiguration config)
{
    public TokensResponse GenerateTokens(TokenPayload payload, Guid sessionId)
    {
        var (accessToken, expiredAt) = GenerateAccessToken(payload, sessionId);
        var (rawRefreshToken, tokenHash) = GenerateRefreshToken();
        return new TokensResponse
        (
            accessToken, expiredAt, rawRefreshToken,
            tokenHash
        );
    }

    private (string accessToken, DateTime expiredAt) GenerateAccessToken(TokenPayload payload, Guid sessionId)
    {
        var secret = config["Jwt:Secret"]!;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiredAt = DateTime.UtcNow.AddMinutes(15);

        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = config["Jwt:Issuer"],
            Audience = config["Jwt:Audience"],
            Expires = expiredAt,
            SigningCredentials = credentials,
            Claims = new Dictionary<string, object>
            {
                [JwtRegisteredClaimNames.Sub] = payload.UserId.ToString(),
                [JwtRegisteredClaimNames.Email] = payload.Email,
                ["sid"] = sessionId.ToString() // Gắn SessionId để biết request thuộc thiết bị nào
            }
        };

        return (new JsonWebTokenHandler().CreateToken(descriptor), expiredAt);
    }

    private (string RawToken, string TokenHash) GenerateRefreshToken()
    {
        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        var tokenHash = HashToken(rawToken);
        return (rawToken, tokenHash);
    }

    public string HashToken(string rawToken)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawToken));
        return Convert.ToHexString(bytes);
    }
}