using Ecome.Api.Common.Auth;
using Ecome.Api.Common.Results;
using Ecome.Api.Data;
using Ecome.Api.Features.Me.Responses;
using Microsoft.EntityFrameworkCore;

namespace Ecome.Api.Features.Me;

public class MeService(AppDbContext db, IamPermissionService iamService)
{
    public async Task<Result<MeResponse>> GetMeAsync(Guid userId, CancellationToken ct)
    {
        var profile = await db.Users
            .AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.Name,
                u.Phone,
                u.PhotoUrl,
                u.BackgroundUrl,
                u.Bio,
                u.CreatedAt
            })
            .FirstOrDefaultAsync(ct);

        if (profile is null)
            return Error.NotFound("User not found.");

        var access = await iamService.GetUserAccessAsync(userId, ct);

        return new MeResponse(
            profile.Id,
            profile.Email,
            profile.Name,
            profile.Phone,
            profile.PhotoUrl,
            profile.BackgroundUrl,
            profile.Bio,
            profile.CreatedAt,
            access.Roles,
            access.Permissions
        );
    }
}