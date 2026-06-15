using DealZy.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DealZy.Infrastructure.Data.Configurations;

public class AdPhotoConfiguration : IEntityTypeConfiguration<AdPhoto>
{
    public void Configure(EntityTypeBuilder<AdPhoto> builder)
    {
        builder.HasOne(p => p.Ad)
            .WithMany(a => a.Photos)
            .HasForeignKey(p => p.AdId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(p => p.AdId);

        builder.Property(p => p.Url).IsRequired();
    }
}
