using DealZy.Domain.Models;
using DealZy.Domain.DTO.CategoryDTO;
using DealZy.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DealZy.Api.Controllers;

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

        CategoryDto MapToDto(Category c) => new CategoryDto
        {
            Id       = c.Id,
            Name     = c.Name,
            Children = c.Children.Select(MapToDto).ToList()
        };

        return Ok(categories.Select(MapToDto).ToList());
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
            return BadRequest("Invalid ID format");

        var path = new List<CategoryBreadcrumbDto>();
        var current = await _context.Categories.FirstOrDefaultAsync(c => c.Id == guid);

        if (current == null) return NotFound();

        while (current != null)
        {
            path.Insert(0, new CategoryBreadcrumbDto { Id = current.Id, Name = current.Name });

            if (current.ParentId.HasValue)
                current = await _context.Categories.FirstOrDefaultAsync(c => c.Id == current.ParentId.Value);
            else
                break;
        }

        return Ok(path);
    }
}
