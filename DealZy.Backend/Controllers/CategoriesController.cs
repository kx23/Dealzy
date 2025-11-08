using DealZy.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using DealZy.Backend.Models.DTO;

namespace DealZy.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .Where(c => c.ParentId == null)
                .Include(c => c.Children)
                .ToListAsync();
            
            var result = categories.Select(c => MapToDto(c)).ToList();

            CategoryDto MapToDto(Category c) => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Children = c.Children.Select(MapToDto).ToList()
            };

            return Ok(result);
        }


        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }
    }
}
