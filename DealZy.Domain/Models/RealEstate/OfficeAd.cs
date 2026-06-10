using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class OfficeAd : CommercialAd
{
    public OfficeClass? Class { get; set; }

    public OfficeBuildingType? BuildingType { get; set; }

    public OfficeAccessMode? AccessMode { get; set; }

    public OfficeCondition? Condition { get; set; }
}
