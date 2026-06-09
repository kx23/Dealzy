using DealZy.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace DealZy.Infrastructure.Data;

public static class ApplicationDbContextSeed
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<User> userManager, IConfiguration configuration)
    {
        if (!context.Categories.Any())
        {
            var realEstate = new Category
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Недвижимость"
            };

            var categories = new[]
            {
                realEstate,
                new Category { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Собственный дом",          ParentId = realEstate.Id },
                new Category { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Квартира",                  ParentId = realEstate.Id },
                new Category { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Коммерческая недвижимость", ParentId = realEstate.Id },
                new Category { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), Name = "Земельный участок",         ParentId = realEstate.Id },
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();
        }

        if (!context.Users.Any())
        {
            var admin = new User
            {
                UserName       = configuration["Seed:AdminUsername"] ?? "admin",
                Email          = configuration["Seed:AdminEmail"]    ?? "admin@dealzy.com",
                EmailConfirmed = true,
            };

            await userManager.CreateAsync(admin, configuration["Seed:AdminPassword"] ?? "Admin123!");
        }
    }
}
