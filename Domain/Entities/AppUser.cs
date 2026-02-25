using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class AppUser : BaseEntity
{
    public string KeycloakSub { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();
}