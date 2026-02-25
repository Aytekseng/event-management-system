using Application.Common.Abstractions;
using Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Events.Commands.UnRegisterFromEvent;

public class UnRegisterFromEventHandler : IRequestHandler<UnRegisterFromEventCommand, Unit>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUser _currentUser;

    public UnRegisterFromEventHandler(IAppDbContext context, ICurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Unit> Handle(UnRegisterFromEventCommand request, CancellationToken cancellationToken)
    {
        if (!_currentUser.IsAuthenticated)
            throw new UnauthorizedAccessException();

        var userId = _currentUser.UserId!;

        var registration = await _context.EventRegistrations
            .FirstOrDefaultAsync(x => x.EventId == request.EventId && x.UserId == userId, cancellationToken);

        if (registration == null)
            throw new Exception("Registration not found.");

        _context.EventRegistrations.Remove(registration);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}