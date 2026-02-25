using Application.Common.Abstractions;
using Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Events.Commands.DeleteEvent;

public class DeleteEventHandler : IRequestHandler<DeleteEventCommand, Unit>
{
    private readonly IAppDbContext _context;

    public DeleteEventHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteEventCommand request, CancellationToken cancellationToken)
    {
        var e = await _context.Events.FirstOrDefaultAsync(x => x.Id == request.EventId);
        if(e is null)
            throw new NotFoundException("Etkinlik bulunamadı!");

        _context.Events.Remove(e);
        await _context.SaveChangesAsync();
        return Unit.Value;
        
    }
}