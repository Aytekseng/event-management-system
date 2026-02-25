using Application.Common.Abstractions;
using Application.Common.Exceptions;
using Domain.Entities;
using MediatR;

namespace Application.Features.Events.Commands.CreateEvent;

public class CreateEventHandler : IRequestHandler<CreateEventCommand, Guid>
{
    private readonly IAppDbContext _context;

    public CreateEventHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        if(string.IsNullOrWhiteSpace(request.Title))
            throw new NotFoundException("Başlık boş olamaz!");
        if(request.Capacity <= 0)
            throw new ValidationException("Kapasite pozitif bir sayı olmalı!");
        if(string.IsNullOrWhiteSpace(request.Location))
            throw new ValidationException("Konum boş bırakılamaz!");

        var entity = new Event
        {
            Title = request.Title,
            Capacity = request.Capacity,
            EventDate = request.EventDate,
            Location = request.Location,
            Description = request.Description
        };
        _context.Events.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return entity.Id;
    }
}