using DealZy.Backend.Models.RealEstate;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace DealZy.Backend.Models
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

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
            
            
            // Old way
            // new CategoryConfiguration().Configure(modelBuilder.Entity<Category>());
            // new AddressConfiguration().Configure(modelBuilder.Entity<Address>());
            // new RealEstateAdConfiguration().Configure(modelBuilder.Entity<RealEstateAd>());
            
            // Apply all entity configurations automatically
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
            
            modelBuilder.Entity<Ad>()
                .HasOne(a => a.Address)
                .WithMany()  // No navigation back to ads from Address
                .HasForeignKey(a => a.AddressId)
                .OnDelete(DeleteBehavior.SetNull);

            
            modelBuilder.Entity<Ad>()
                .HasOne(a => a.Category)
                .WithMany(c => c.Ads)
                .HasForeignKey(a => a.CategoryId);
            
            // Add indexes for better query performance
            modelBuilder.Entity<Address>()
                .HasIndex(a => new { a.Latitude, a.Longitude })
                .HasDatabaseName("IX_Address_Coordinates");
            
            modelBuilder.Entity<Ad>()
                .HasIndex(r => r.AddressId);
        
        }
    }
}
