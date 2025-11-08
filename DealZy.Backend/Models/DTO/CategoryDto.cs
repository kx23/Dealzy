namespace DealZy.Backend.Models.DTO;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<CategoryDto> Children { get; set; } = new();
}