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
        
        public DbSet<RealEstateAd> RealEstateAds { get; set; }
        public DbSet<HouseAd> HouseAds { get; set; }
        public DbSet<ApartmentAd> ApartmentAds { get; set; }
        public DbSet<CommercialBuildingAd> CommercialBuildingAds { get; set; }
        public DbSet<LandPlotAd> LandPlotAds { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.Children)
                .WithOne(c => c.Parent)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            
            modelBuilder.Entity<Ad>()
                .HasOne(a => a.Category)
                .WithMany(c => c.Ads)
                .HasForeignKey(a => a.CategoryId);

            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    Name = "Транспорт",
                    ParentId = null
                },
                new Category
                {
                    Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    Name = "Недвижимость",
                    ParentId = null
                },
                
                new Category
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    Name = "Собственный дом",
                    ParentId = Guid.Parse("22222222-2222-2222-2222-222222222222")
                },
                new Category
                {
                    Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    Name = "Квартира",
                    ParentId = Guid.Parse("22222222-2222-2222-2222-222222222222")
                },
                new Category
                {
                    Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    Name = "Коммерческая недвижимость",
                    ParentId = Guid.Parse("22222222-2222-2222-2222-222222222222")
                },
                new Category
                {
                    Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                    Name = "Земельный участок",
                    ParentId = Guid.Parse("22222222-2222-2222-2222-222222222222")
                }
                
            );
        
        }
    }
}
