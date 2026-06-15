using DealZy.Domain.Models;
using DealZy.Infrastructure.Data;
using DealZy.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DealZy.Api.Controllers;

[Route("api/ads/{adId}/photos")]
[ApiController]
[Authorize]
public class AdPhotosController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ICloudinaryService _cloudinary;
    private readonly ILogger<AdPhotosController> _logger;

    public AdPhotosController(ApplicationDbContext context, ICloudinaryService cloudinary, ILogger<AdPhotosController> logger)
    {
        _context = context;
        _cloudinary = cloudinary;
        _logger = logger;
    }

    // GET: api/ads/{adId}/photos
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<object>>> GetPhotos(Guid adId)
    {
        var photos = await _context.AdPhotos
            .Where(p => p.AdId == adId)
            .OrderBy(p => p.Order)
            .Select(p => new { p.Id, p.Url, p.Order })
            .ToListAsync();

        return Ok(photos);
    }

    // POST: api/ads/{adId}/photos
    [HttpPost]
    public async Task<ActionResult<object>> UploadPhoto(Guid adId, IFormFile file)
    {
        var ad = await _context.Ads.FindAsync(adId);
        if (ad == null) return NotFound();

        if (file == null || file.Length == 0)
            return BadRequest("No file provided.");

        var url = await _cloudinary.UploadAdPhotoAsync(file, adId);

        var maxOrder = await _context.AdPhotos
            .Where(p => p.AdId == adId)
            .Select(p => (int?)p.Order)
            .MaxAsync() ?? -1;

        var photo = new AdPhoto
        {
            AdId = adId,
            Url = url,
            Order = maxOrder + 1
        };

        _context.AdPhotos.Add(photo);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Photo added: photoId={PhotoId} adId={AdId}", photo.Id, adId);
        return Ok(new { photo.Id, photo.Url, photo.Order });
    }

    // DELETE: api/ads/{adId}/photos/{photoId}
    [HttpDelete("{photoId}")]
    public async Task<IActionResult> DeletePhoto(Guid adId, Guid photoId)
    {
        var photo = await _context.AdPhotos.FirstOrDefaultAsync(p => p.Id == photoId && p.AdId == adId);
        if (photo == null) return NotFound();

        await _cloudinary.DeleteImageByUrlAsync(photo.Url);

        _context.AdPhotos.Remove(photo);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Photo deleted: photoId={PhotoId} adId={AdId}", photoId, adId);
        return NoContent();
    }

    // PATCH: api/ads/{adId}/photos/reorder
    [HttpPatch("reorder")]
    public async Task<IActionResult> Reorder(Guid adId, [FromBody] List<PhotoOrderDto> orders)
    {
        var photos = await _context.AdPhotos.Where(p => p.AdId == adId).ToListAsync();

        foreach (var item in orders)
        {
            var photo = photos.FirstOrDefault(p => p.Id == item.Id);
            if (photo != null) photo.Order = item.Order;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class PhotoOrderDto
{
    public Guid Id { get; set; }
    public int Order { get; set; }
}
