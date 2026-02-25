using Application.Features.Events.Dtos;
using Domain.Entities;
using MediatR;

namespace Application.Features.Events.Queries.GetEvents;

public class GetEventsQuery : IRequest<List<EventListItemDto>>
{
    
}