using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class AdDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal? Price { get; set; }
    public string? MainPhotoUrl { get; set; }
    public List<string> PhotoUrls { get; set; } = new();
    public DealType DealType { get; set; }
    public string PropertyKind { get; set; }
    public double? Area { get; set; }
    public SellerType? SellerType { get; set; }
    public AddressDto Address { get; set; }
}
