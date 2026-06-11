using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class CreateOfficeAdDto : CreateAdBaseDto
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
    public OfficeClass? Class { get; set; }
    public OfficeBuildingType? BuildingType { get; set; }
    public OfficeAccessMode? AccessMode { get; set; }
    public OfficeCondition? Condition { get; set; }
}
