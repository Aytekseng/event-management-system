using Domain.Common;

namespace Domain.Entities;

public class EventRegistration : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    public AppUser User { get; set; }
    public Event Event { get; set; }
}