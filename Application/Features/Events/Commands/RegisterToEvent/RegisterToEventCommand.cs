using MediatR;

namespace Application.Features.Events.Commands.RegisterToEvents;

public class RegisterToEventCommand : IRequest<Unit>
{
    public Guid EventId { get; set; }
}