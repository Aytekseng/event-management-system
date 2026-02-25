using Application.Common.Abstractions;
using Application.Features.Events.Dtos;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Events.Queries.GetParticipants;

public class GetParticipantsHandler : IRequestHandler<GetParticipantsQuery, List<ParticipantDto>>
{
    private readonly IAppDbContext _context;

    public GetParticipantsHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ParticipantDto>> Handle(GetParticipantsQuery request, CancellationToken cancellationToken)
    {
        return await _context.EventRegistrations
            .Where(r => r.EventId == request.EventId)
            .Include(r => r.User)
            .Select(r => new ParticipantDto
            {
                Id = r.User.Id,
                DisplayName = r.User.DisplayName,
                Email = r.User.Email
            })
            .ToListAsync(cancellationToken);
    }
}