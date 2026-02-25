using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Abstractions;

public interface IAppDbContext
{
    DbSet<AppUser> Users { get; set; }
    DbSet<Event> Events { get; set; }
    DbSet<EventRegistration> EventRegistrations { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}