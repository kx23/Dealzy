﻿using System.ComponentModel.DataAnnotations;

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
    }
}
