using MediatR;

namespace Application.Features.Events.Commands.UpdateEvent;

public class UpdateEventCommand : IRequest<Unit>
{
    public Guid EventId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int Capacity { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}