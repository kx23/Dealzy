using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class AdResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal? Price { get; set; }
    public string? MainPhotoUrl { get; set; }
    public DealType DealType { get; set; }
    public string PropertyKind { get; set; }
}
