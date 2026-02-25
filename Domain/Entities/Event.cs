using Domain.Common;

namespace Domain.Entities;

public class Event : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int Capacity { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();
}