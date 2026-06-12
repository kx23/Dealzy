using System.ComponentModel.DataAnnotations;
using DealZy.Domain.Enums;

namespace DealZy.Domain.Models;

public class Ad
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Title { get; set; }

    [MaxLength(500)]
    public string Description { get; set; }

    [Required]
    [Range(0, 1000000)]
    public decimal Price { get; set; }

    public string ImageUrl { get; set; }

    public DealType DealType { get; set; }
}
