using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DealZy.Backend.Models.Enums;

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
        
        [ForeignKey(nameof(ParentId))]
        public Category Parent { get; set; }

        public ICollection<Category> Children { get; set; } = new List<Category>();

        public ICollection<Ad> Ads { get; set; } = new List<Ad>();
        
        public AdType AdType { get; set; }
    }
}
