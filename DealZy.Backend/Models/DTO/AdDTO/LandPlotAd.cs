namespace DealZy.Backend.Models.DTO.AdDTO;

public class LandPlotAd
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public string Address { get; set; }
    public decimal Price { get; set; }
    public double Area { get; set; }
    
    public string CategoryName { get; set; }
}