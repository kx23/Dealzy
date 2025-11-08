using System.ComponentModel.DataAnnotations;

namespace DealZy.Backend.Models.RealEstate;

public class HouseAd: RealEstateAd
{
    [Required]
    public double HouseArea { get; set; } 
    [Required]
    public double LandArea { get; set; }  
    [Required]
    public int Floors { get; set; }       
    [Required]
    public int Rooms { get; set; }  
}