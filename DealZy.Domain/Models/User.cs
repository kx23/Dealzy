using Microsoft.AspNetCore.Identity;

namespace DealZy.Domain.Models;

public class User : IdentityUser
{
    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
}
