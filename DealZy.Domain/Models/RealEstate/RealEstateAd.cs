using System.ComponentModel.DataAnnotations;
using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public abstract class RealEstateAd : Ad
{
    public double? Area { get; set; }

    public SellerType? SellerType { get; set; }

    public Guid? AddressId { get; set; }
    public Address Address { get; set; }

    // Rent-specific (null for sale ads)
    public RentPeriod? RentPeriod { get; set; }

    public RentalAmenities? Amenities { get; set; }

    public LivingConditions? LivingConditions { get; set; }

    public BathType? BathType { get; set; }

    public bool? NoDeposit { get; set; }
}
