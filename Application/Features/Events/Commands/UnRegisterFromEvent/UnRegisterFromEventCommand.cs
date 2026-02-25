using MediatR;

namespace Application.Features.Events.Commands.UnRegisterFromEvent;

public class UnRegisterFromEventCommand : IRequest<Unit>
{
    public Guid EventId { get; set; }
}