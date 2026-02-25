using Application.Common.Abstractions;
using Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Events.Commands.UpdateEvent;

public class UpdateEventHandler : IRequestHandler<UpdateEventCommand, Unit>
{
    private readonly IAppDbContext _context;

    public UpdateEventHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(UpdateEventCommand request, CancellationToken cancellationToken)
    {
        var e = await _context.Events.FirstOrDefaultAsync(x => x.Id ==  request.EventId,cancellationToken);
        if(e is null)
            throw new NotFoundException("Etkinlik bulunamadı!");
        if(string.IsNullOrWhiteSpace(e.Title) || e.Capacity <= 0 || string.IsNullOrWhiteSpace(e.Description) || string.IsNullOrWhiteSpace(e.Location))
            throw new ValidationException("Boş alanlar mevcut!");
        e.Title = request.Title;
        e.EventDate = request.EventDate;
        e.Location = request.Location;
        e.Description = request.Description;
        var registeredCount = await _context.EventRegistrations.CountAsync(x => x.EventId == request.EventId,cancellationToken);
        if(request.Capacity < registeredCount)
            throw new Exception("409");
        await _context.SaveChangesAsync();
        return Unit.Value;
    }
}