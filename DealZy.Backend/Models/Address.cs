using System.ComponentModel.DataAnnotations;

namespace DealZy.Backend.Models;

public class Address
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(500)]
    public string DisplayName { get; set; }  // "Москва, ул. Тверская, д. 1"
    
    [Required]
    public double Latitude { get; set; }
    
    [Required]
    public double Longitude { get; set; }
    
    // Detailed address components (optional)
    [MaxLength(100)]
    public string City { get; set; }
    
    [MaxLength(100)]
    public string Street { get; set; }
    
    [MaxLength(20)]
    public string HouseNumber { get; set; }
    
    [MaxLength(20)]
    public string PostalCode { get; set; }
    
    [MaxLength(100)]
    public string Country { get; set; }
    
    [MaxLength(100)]
    public string State { get; set; }
    
}