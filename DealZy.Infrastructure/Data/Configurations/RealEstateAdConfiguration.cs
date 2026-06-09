using DealZy.Domain.Models.RealEstate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DealZy.Infrastructure.Data.Configurations;

public class RealEstateAdConfiguration : IEntityTypeConfiguration<RealEstateAd>
{
    public void Configure(EntityTypeBuilder<RealEstateAd> builder)
    {
        builder.HasOne(a => a.Address)
            .WithMany()
            .HasForeignKey(a => a.AddressId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(a => a.AddressId);
    }
}
