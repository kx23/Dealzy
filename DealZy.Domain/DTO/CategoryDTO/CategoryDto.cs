using System.Text.Json.Serialization;

namespace DealZy.Domain.DTO.CategoryDTO;

public class CategoryDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("children")]
    public List<CategoryDto> Children { get; set; } = new();
}
