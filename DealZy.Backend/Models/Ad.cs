using System.ComponentModel.DataAnnotations;
using DealZy.Backend.Models.Enums;

namespace DealZy.Backend.Models
{
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

        [Url]
        public string ImageUrl { get; set; }

        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
        
        public Guid? AddressId { get; set; }
        public Address Address { get; set; }
    }
}
