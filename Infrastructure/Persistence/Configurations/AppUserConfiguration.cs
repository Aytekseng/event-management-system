using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.ToTable("users");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.KeycloakSub)
                .IsRequired()
                .HasMaxLength(128);
        builder.HasIndex(x => x.KeycloakSub)
                .IsUnique();
        builder.Property(x => x. DisplayName)
                .HasMaxLength(128);
    }
}