using System.ComponentModel.DataAnnotations;

namespace DealZy.Backend.Models.RealEstate;

public class RealEstateAd: Ad
{
    [Required]
    public double Area { get; set; } 

    [Required]
    public string SellerType { get; set; } 

    [Required]
    [MaxLength(500)]
    public string Address { get; set; } 
}