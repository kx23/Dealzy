using System.ComponentModel.DataAnnotations;
using DealZy.Domain.Enums;

namespace DealZy.Domain.Models;

public class Ad
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(100)]
    public string? Title { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(0, 1000000)]
    public decimal? Price { get; set; }

    public DealType DealType { get; set; }

    public AdStatus Status { get; set; } = AdStatus.Draft;

    public ICollection<AdPhoto> Photos { get; set; } = new List<AdPhoto>();

    public string? UserId { get; set; }
    public User? User { get; set; }
}
