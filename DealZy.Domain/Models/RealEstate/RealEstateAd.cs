using System.ComponentModel.DataAnnotations;

namespace DealZy.Domain.Models.RealEstate;

public abstract class RealEstateAd : Ad
{
    [Required]
    public double Area { get; set; }

    public string SellerType { get; set; }

    public Guid? AddressId { get; set; }
    public Address Address { get; set; }
}
