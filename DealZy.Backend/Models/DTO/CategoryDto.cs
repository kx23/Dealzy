using System.Text.Json.Serialization;
using DealZy.Backend.Models.Enums;

namespace DealZy.Backend.Models.DTO;

public class CategoryDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("adType")]
    public AdType AdType {get; set;}
    
    [JsonPropertyName("children")]
    public List<CategoryDto> Children { get; set; } = new();
}