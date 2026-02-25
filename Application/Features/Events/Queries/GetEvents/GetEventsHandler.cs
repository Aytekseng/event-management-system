using Application.Common.Abstractions;
using Application.Features.Events.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Events.Queries.GetEvents;

public class GetEventsHandler : IRequestHandler<GetEventsQuery, List<EventListItemDto>>
{
    private readonly IAppDbContext _context;

    public GetEventsHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventListItemDto>> Handle(GetEventsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Events
                    .OrderByDescending(x => x.EventDate)
                    .Select(x => new EventListItemDto
                    {
                        Id = x.Id,
                        Title = x.Title,
                        EventDate = x.EventDate,
                        Capacity = x.Capacity,
                        Location = x.Location,
                        Description = x.Description
                    })
                    .ToListAsync(cancellationToken);
    }
}