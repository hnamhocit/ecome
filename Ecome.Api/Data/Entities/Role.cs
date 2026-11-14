using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Ecome.Api.Data.Entities;

[Index(nameof(Name), IsUnique = true)]
public class Role
{
    public Guid Id { get; set; } = Guid.CreateVersion7();

    [MaxLength(50)] public string Name { get; set; } = "";

    [MaxLength(255)] public string? Description { get; set; }

    public bool IsSystem { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<UserRole> UserRoles { get; set; } = [];
    public ICollection<RolePermission> RolePermissions { get; set; } = [];
}