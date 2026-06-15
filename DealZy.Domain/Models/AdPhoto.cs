using System.ComponentModel.DataAnnotations;

namespace DealZy.Domain.Models;

public class AdPhoto
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid AdId { get; set; }
    public Ad Ad { get; set; }

    [Required]
    public string Url { get; set; }

    public int Order { get; set; }
}
