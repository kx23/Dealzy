using System.ComponentModel.DataAnnotations;

namespace DealZy.Backend.Models
{
    public class Category
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public Guid? ParentId { get; set; }
        public Category? Parent { get; set; }

        public ICollection<Category> Children { get; set; } = new List<Category>();

        public ICollection<Ad> Ads { get; set; } = new List<Ad>();
    }
}
