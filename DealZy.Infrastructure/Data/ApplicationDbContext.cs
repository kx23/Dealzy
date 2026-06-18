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
    public DbSet<AdPhoto> AdPhotos { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Address> Addresses { get; set; }

    public DbSet<RealEstateAd> RealEstateAds { get; set; }
    public DbSet<HouseAd> HouseAds { get; set; }
    public DbSet<ApartmentAd> ApartmentAds { get; set; }
    public DbSet<OfficeAd> OfficeAds { get; set; }
    public DbSet<RetailAd> RetailAds { get; set; }
    public DbSet<WarehouseAd> WarehouseAds { get; set; }
    public DbSet<BusinessAd> BusinessAds { get; set; }
    public DbSet<CoworkingAd> CoworkingAds { get; set; }
    public DbSet<LandPlotAd> LandPlotAds { get; set; }
    public DbSet<GarageAd> GarageAds { get; set; }
    public DbSet<RoomAd> RoomAds { get; set; }
    public DbSet<HousePartAd> HousePartAds { get; set; }
    public DbSet<TownhouseAd> TownhouseAds { get; set; }
    public DbSet<BedAd> BedAds { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
