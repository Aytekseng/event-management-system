using Application.Common.Abstractions;
using Application.Common.Exceptions;
using Application.Features.Events.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Events.Queries.GetEventDetails;

public class GetEventDetailHandler : IRequestHandler<GetEventDetailQuery, EventDetailDto>
{
    private readonly IAppDbContext _context;

    public GetEventDetailHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<EventDetailDto> Handle(GetEventDetailQuery request, CancellationToken cancellationToken)
    {
        var e = await _context.Events.FirstOrDefaultAsync(x => x.Id == request.Id,cancellationToken);
        if(e is null)
            throw new NotFoundException("Etkinlik bulunamadı!");
        var registeredCount = await _context.EventRegistrations.CountAsync(x => x.EventId == request.Id,cancellationToken);
        return new EventDetailDto
        {
            Id = e.Id,
            Title = e.Title,
            EventDate = e.EventDate,
            Capacity = e.Capacity,
            Location = e.Location,
            Description = e.Description,
            RegisteredCount = registeredCount
        };
    }
}