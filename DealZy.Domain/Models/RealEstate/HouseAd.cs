using System.ComponentModel.DataAnnotations;
using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class HouseAd : RealEstateAd
{
    [Required]
    public double HouseArea { get; set; }

    [Required]
    public double LandArea { get; set; }

    [Required]
    public int Floors { get; set; }

    [Required]
    public int Rooms { get; set; }

    public int? Bedrooms { get; set; }

    public int? ConstructionYear { get; set; }

    public SuburbanPropertyType? PropertyType { get; set; }

    public SuburbanHouseType? HouseType { get; set; }

    public HouseMaterial? Material { get; set; }

    public LandStatus? LandStatus { get; set; }

    public SuburbanUtilities? Utilities { get; set; }

    public HeatingType? HeatingType { get; set; }

    public bool? BathroomInHouse { get; set; }

    public bool? OutdoorBathroom { get; set; }

    public bool? HasBanya { get; set; }

    public bool? HasGarage { get; set; }

    public bool? HasSecurity { get; set; }

    public bool? HasPool { get; set; }
}
