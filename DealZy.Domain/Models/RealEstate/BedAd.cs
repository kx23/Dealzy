using System.ComponentModel.DataAnnotations;
using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class BedAd : RealEstateAd
{
    [Required]
    public int ApartmentFloor { get; set; }

    [Required]
    public int BuildingFloors { get; set; }

    public int? BedsInRoom { get; set; }

    public BathroomType? BathroomType { get; set; }

    public RenovationType? RenovationType { get; set; }

    public BuildingType? BuildingType { get; set; }

    public ElevatorType? ElevatorType { get; set; }

    public int? ConstructionYear { get; set; }
}
