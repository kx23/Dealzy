using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class RetailAd : CommercialAd
{
    public RetailSpaceType? SpaceType { get; set; }

    public RetailEntranceType? EntranceType { get; set; }

    public bool? IsFirstLine { get; set; }

    public RetailBuildingType? BuildingType { get; set; }

    public RetailCondition? Condition { get; set; }
}
