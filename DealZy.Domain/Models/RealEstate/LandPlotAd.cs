using DealZy.Domain.Enums;

namespace DealZy.Domain.Models.RealEstate;

public class LandPlotAd : RealEstateAd
{
    public LandStatus? LandStatus { get; set; }

    public SuburbanUtilities? Utilities { get; set; }
}
