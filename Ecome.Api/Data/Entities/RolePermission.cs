using Microsoft.EntityFrameworkCore;

namespace Ecome.Api.Data.Entities;

[PrimaryKey(nameof(RoleId), nameof(PermissionId))]
public class RolePermission
{
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;

    public Guid PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
}