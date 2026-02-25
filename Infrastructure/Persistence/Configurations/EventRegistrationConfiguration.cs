using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class EventRegistrationConfiguration : IEntityTypeConfiguration<EventRegistration>
{
    public void Configure(EntityTypeBuilder<EventRegistration> builder)
    {
        builder.ToTable("event_registrations");
        builder.HasKey(x => x.Id);
        builder.HasOne(x => x.User)
                .WithMany(x => x.EventRegistrations)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.Event)
                .WithMany(x => x.EventRegistrations)
                .HasForeignKey(x => x.EventId)
                .OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(x => new { x.EventId, x.UserId })
                .IsUnique();
        builder.Property(x => x.RegisteredAt)
                .IsRequired();
    }
}