using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class CreateCoworkingAdDto : CreateAdBaseDto
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
    public CoworkingIncludes? Includes { get; set; }
    public CoworkingAccess? Access { get; set; }
}
