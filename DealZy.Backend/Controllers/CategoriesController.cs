using DealZy.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using DealZy.Backend.Models.DTO;
using DealZy.Backend.Models.DTO.CategoryDTO;

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
                AdType = c.AdType,
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
        
        [HttpGet("{id}/path")]
        public async Task<ActionResult<List<CategoryBreadcrumbDto>>> GetCategoryPath(string id)
        {
            if (!Guid.TryParse(id, out var guid))
            {
                return BadRequest("Invalid ID format");
            }
    
            var path = new List<CategoryBreadcrumbDto>();
            var currentCategory = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == guid);
    
            if (currentCategory == null)
            {
                return NotFound();
            }
    
            // Build path from current category to root
            while (currentCategory != null)
            {
                path.Insert(0, new CategoryBreadcrumbDto
                {
                    Id = currentCategory.Id,
                    Name = currentCategory.Name
                });
        
                if (currentCategory.ParentId.HasValue)
                {
                    currentCategory = await _context.Categories
                        .FirstOrDefaultAsync(c => c.Id == currentCategory.ParentId.Value);
                }
                else
                {
                    break;
                }
            }
    
            return Ok(path);
        }
    }
}
