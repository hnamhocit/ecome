namespace Ecome.Api.Features.Me.Responses;

public record UserSessionItemResponse(
    Guid Id,
    string? IpAddress,
    string? Browser,
    string? Os,
    string DeviceType,
    string? RawUserAgent,
    DateTime CreatedAt,
    DateTime? LastUsedAt,
    DateTime ExpiresAt,
    bool IsCurrent
);

public record RevokeOthersResponse(int RevokedCount);
