using System.ComponentModel.DataAnnotations;
using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class TownhouseAd : RealEstateAd
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

    public bool? HasGarage { get; set; }

    public bool? HasPool { get; set; }

    // Total sections in the row
    public int? SectionsTotal { get; set; }

    // Corner/end section of the row
    public bool? IsEndSection { get; set; }
}
