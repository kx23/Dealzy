using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class AdResponseDto
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public List<string> PhotoUrls { get; set; } = new();
    public DealType DealType { get; set; }
    public string PropertyKind { get; set; }

    // Common real estate fields
    public double? Area { get; set; }
    public SellerType? SellerType { get; set; }
    public string? City { get; set; }
    public string? AddressDisplay { get; set; }

    // Kind-specific
    public int? Rooms { get; set; }
    public int? Floor { get; set; }
    public int? BuildingFloors { get; set; }

    public string? AuthorName { get; set; }
}
