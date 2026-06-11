using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public abstract class CreateAdBaseDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public decimal Price { get; set; }
    public DealType DealType { get; set; }

    // RealEstateAd fields
    public double Area { get; set; }
    public SellerType? SellerType { get; set; }
    public AddressDto Address { get; set; }

    // Rent-specific
    public RentPeriod? RentPeriod { get; set; }
    public RentalAmenities? Amenities { get; set; }
    public LivingConditions? LivingConditions { get; set; }
    public BathType? BathType { get; set; }
    public bool? NoDeposit { get; set; }
}
