using DealZy.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DealZy.Infrastructure.Data.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.Property(a => a.DisplayName)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasIndex(a => new { a.Latitude, a.Longitude })
            .HasDatabaseName("IX_Address_Coordinates");
    }
}
