using System.ComponentModel.DataAnnotations;

namespace DealZy.Backend.Models.RealEstate;

public abstract class RealEstateAd: Ad
{
    [Required]
    public double Area { get; set; } 
    
    public string SellerType { get; set; } 

    // Address relationship
    public Guid? AddressId { get; set; }  // Nullable if address is optional
    public Address Address { get; set; }
}