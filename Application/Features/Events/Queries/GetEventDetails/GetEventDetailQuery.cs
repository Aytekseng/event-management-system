using Application.Features.Events.Dtos;
using MediatR;

namespace Application.Features.Events.Queries.GetEventDetails;

public class GetEventDetailQuery : IRequest<EventDetailDto>
{
    public Guid Id { get; set; }
}