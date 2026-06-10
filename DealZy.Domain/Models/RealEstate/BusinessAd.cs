using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class BusinessAd : CommercialAd
{
    public BusinessCondition? Condition { get; set; }

    public BusinessPropertyOwnership? PropertyOwnership { get; set; }
}
