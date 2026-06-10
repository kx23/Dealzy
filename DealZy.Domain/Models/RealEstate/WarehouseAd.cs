using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class WarehouseAd : CommercialAd
{
    public WarehouseClass? Class { get; set; }

    public WarehouseBuildingType? BuildingType { get; set; }

    public WarehouseCondition? Condition { get; set; }

    public WarehouseHeatingType? HeatingType { get; set; }
}
