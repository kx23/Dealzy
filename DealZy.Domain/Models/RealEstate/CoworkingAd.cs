using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class CoworkingAd : CommercialAd
{
    public CoworkingIncludes? Includes { get; set; }

    public CoworkingAccess? Access { get; set; }
}
