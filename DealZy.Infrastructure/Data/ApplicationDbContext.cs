using DealZy.Domain.Models;
using DealZy.Domain.Models.RealEstate;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DealZy.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Ad> Ads { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Address> Addresses { get; set; }

    public DbSet<RealEstateAd> RealEstateAds { get; set; }
    public DbSet<HouseAd> HouseAds { get; set; }
    public DbSet<ApartmentAd> ApartmentAds { get; set; }
    public DbSet<CommercialBuildingAd> CommercialBuildingAds { get; set; }
    public DbSet<LandPlotAd> LandPlotAds { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
