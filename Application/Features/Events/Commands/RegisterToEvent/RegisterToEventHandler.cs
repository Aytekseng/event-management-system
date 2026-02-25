using Application.Common.Abstractions;
using Application.Common.Exceptions;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Events.Commands.RegisterToEvents;

public class RegisterToEventHandler : IRequestHandler<RegisterToEventCommand, Unit>
{
    private readonly IAppDbContext _context;
    private readonly ICurrentUser _currentUser;

    public RegisterToEventHandler(IAppDbContext context, ICurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<Unit> Handle(RegisterToEventCommand request, CancellationToken cancellationToken)
    {
        if(!_currentUser.IsAuthenticated)
            throw new UnauthorizedAccessException();
        var userId = _currentUser.UserId;
        var exists = await _context.EventRegistrations
            .AnyAsync(x => x.EventId == request.EventId && x.UserId == userId, cancellationToken);

        if (exists)
            throw new Exception("Already registered.");

        var registration = new EventRegistration
        {
            Id = Guid.NewGuid(),
            EventId = request.EventId,
            UserId = userId
        };

        _context.EventRegistrations.Add(registration);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}