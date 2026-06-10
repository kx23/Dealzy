using System.ComponentModel.DataAnnotations;
using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class ApartmentAd : RealEstateAd
{
    [Required]
    public int BuildingFloors { get; set; }

    [Required]
    public int ApartmentFloor { get; set; }

    [Required]
    public int Rooms { get; set; }

    public double? KitchenArea { get; set; }

    public double? LivingArea { get; set; }

    public PropertyObjectType? ObjectType { get; set; }

    public BalconyType? BalconyType { get; set; }

    public bool? IsApartments { get; set; }

    public int? ConstructionYear { get; set; }

    public RenovationType? RenovationType { get; set; }

    public BuildingType? BuildingType { get; set; }

    public double? CeilingHeight { get; set; }

    public ElevatorType? ElevatorType { get; set; }

    public BathroomType? BathroomType { get; set; }

    public bool? HasMultipleBathrooms { get; set; }

    public WindowView? WindowView { get; set; }

    public ParkingType? ParkingType { get; set; }

    public bool? IsShareSale { get; set; }

    public bool? HasRamp { get; set; }

    public bool? IsWheelchairAccessible { get; set; }
}
