using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Ecome.Api.Data.Entities;

[Index(nameof(Code), IsUnique = true)]
public class Permission
{
    public Guid Id { get; set; } = Guid.CreateVersion7();

    [MaxLength(100)] public string Code { get; set; } = ""; // vd: "users.read", "users.ban", "roles.manage"

    [MaxLength(50)] public string Module { get; set; } = ""; // vd: "Users", "IAM", "Catalog", "Orders"

    [MaxLength(255)] public string? Description { get; set; }

    public ICollection<RolePermission> RolePermissions { get; set; } = [];
}