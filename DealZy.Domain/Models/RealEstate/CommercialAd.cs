using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public abstract class CommercialAd : RealEstateAd
{
    public int? FloorMin { get; set; }
    public int? FloorMax { get; set; }

    public bool? HasParking { get; set; }

    public int? ConstructionYear { get; set; }

    public int? BuildingFloors { get; set; }

    public CommercialInfrastructure? Infrastructure { get; set; }

    public CommercialContractType? ContractType { get; set; }

    public CommercialCommissionType? CommissionType { get; set; }

    public FurnitureType? FurnitureType { get; set; }
}
