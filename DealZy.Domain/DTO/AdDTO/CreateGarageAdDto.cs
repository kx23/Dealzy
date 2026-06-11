using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class CreateGarageAdDto : CreateAdBaseDto
{
    public GarageType? GarageType { get; set; }
    public GarageOwnershipStatus? OwnershipStatus { get; set; }
    public GarageUtilities? Utilities { get; set; }
    public ParkingType? ParkingType { get; set; }
}
