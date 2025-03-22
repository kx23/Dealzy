using Microsoft.AspNetCore.Identity;

namespace DealZy.Backend.Models
{
    public class User: IdentityUser
    {
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow; // Дата регистрации

    }
}
