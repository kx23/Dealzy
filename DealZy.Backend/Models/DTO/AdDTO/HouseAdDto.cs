using System.Text.Json.Serialization;

namespace DealZy.Backend.Models.DTO.AdDTO;

public class HouseAdDto
{
    [JsonPropertyName("title")]
    public string Title { get; set; }
    
    [JsonPropertyName("description")]
    public string Description { get; set; }
    
   [JsonPropertyName("imageUrl")]
    public string ImageUrl { get; set; }
    
    // Changed from string to AddressDto object (nullable)
    [JsonPropertyName("address")]
    public AddressDto Address { get; set; }  // null if user didn't select address
    
    
    [JsonPropertyName("price")]
    public decimal Price { get; set; }
    
    [JsonPropertyName("houseArea")]
    public double HouseArea { get; set; }
    
    [JsonPropertyName("landArea")]
    public double LandArea { get; set; }
    
    [JsonPropertyName("floors")]
    public int Floors { get; set; }
    
    [JsonPropertyName("rooms")]
    public int Rooms { get; set; }
    
    [JsonPropertyName("categoryId")]
    public string CategoryId { get; set; }
}