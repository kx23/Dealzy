namespace DealZy.Domain.Models.RealEstate;

public class CommercialBuildingAd : RealEstateAd
{
    public int Floors { get; set; }
    public string? Purpose { get; set; }
}
