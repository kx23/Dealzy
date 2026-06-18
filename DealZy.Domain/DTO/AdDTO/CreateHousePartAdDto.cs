using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class CreateHousePartAdDto : CreateAdBaseDto
{
    public double HouseArea { get; set; }
    public double? LandArea { get; set; }
    public int Floors { get; set; }
    public int Rooms { get; set; }
    public int? Bedrooms { get; set; }
    public int? ConstructionYear { get; set; }
    public HouseMaterial? Material { get; set; }
    public HeatingType? HeatingType { get; set; }
    public bool? BathroomInHouse { get; set; }
    public bool? OutdoorBathroom { get; set; }
    public bool? HasSeparateEntrance { get; set; }
    public int? TotalShares { get; set; }
    public bool? HasGarage { get; set; }
}
