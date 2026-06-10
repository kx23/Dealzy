using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class GarageAd : RealEstateAd
{
    public GarageType? GarageType { get; set; }

    public GarageOwnershipStatus? OwnershipStatus { get; set; }

    public GarageUtilities? Utilities { get; set; }

    public ParkingType? ParkingType { get; set; }
}
