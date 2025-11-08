namespace DealZy.Backend.Models.DTO.AdDTO;

public class HouseAdDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
    public string Address { get; set; }
    public decimal Price { get; set; }
    public double HouseArea { get; set; }
    public double LandArea { get; set; }
    public int Floors { get; set; }
    public int Rooms { get; set; }

    public string CategoryName { get; set; }
}