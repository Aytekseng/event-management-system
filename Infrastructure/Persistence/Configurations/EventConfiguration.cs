using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.ToTable("events");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(255);
        builder.Property(x => x.Capacity)
                .IsRequired();
        builder.Property(x => x.EventDate)
                .IsRequired();
        builder.Property(x => x.Location)
                .HasMaxLength(255);
    }
}