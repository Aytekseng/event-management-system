using Application.Features.Events.Dtos;
using MediatR;

namespace Application.Features.Events.Queries.GetParticipants;

public class GetParticipantsQuery : IRequest<List<ParticipantDto>>
{
    public Guid EventId { get; set; }
}