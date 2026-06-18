using System.ComponentModel.DataAnnotations;
using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class HousePartAd : RealEstateAd
{
    [Required]
    public double HouseArea { get; set; }

    public double? LandArea { get; set; }

    [Required]
    public int Floors { get; set; }

    [Required]
    public int Rooms { get; set; }

    public int? Bedrooms { get; set; }

    public int? ConstructionYear { get; set; }

    public HouseMaterial? Material { get; set; }

    public HeatingType? HeatingType { get; set; }

    public bool? BathroomInHouse { get; set; }

    public bool? OutdoorBathroom { get; set; }

    public bool? HasSeparateEntrance { get; set; }

    // Total number of parts the house is divided into
    public int? TotalShares { get; set; }

    public bool? HasGarage { get; set; }
}
