using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class CreateHouseAdDto : CreateAdBaseDto
{
    public double HouseArea { get; set; }
    public double LandArea { get; set; }
    public int Floors { get; set; }
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
