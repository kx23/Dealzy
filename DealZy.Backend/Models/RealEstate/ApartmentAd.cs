using System.ComponentModel.DataAnnotations;

namespace DealZy.Backend.Models.RealEstate;

public class ApartmentAd:RealEstateAd
{
    [Required]
    public int BuildingFloors { get; set; } 
    
    [Required]
    public int ApartmentFloor { get; set; } 
    
    [Required]
    public int Rooms { get; set; }  
}