using System.Text.Json;
using DealZy.Domain.Models;
using DealZy.Domain.Models.RealEstate;
using DealZy.Domain.DTO.AdDTO;
using DealZy.Infrastructure.Data;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DealZy.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AdsController> _logger;

    public AdsController(ApplicationDbContext context, ILogger<AdsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ad>>> GetAds()
    {
        return await _context.Ads.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Ad>> GetAd(Guid id)
    {
        var ad = await _context.Ads.FindAsync(id);
        if (ad == null) return NotFound();
        return ad;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAd([FromBody] JsonElement request)
    {
        if (!request.TryGetProperty("categoryName", out var categoryElement))
            return BadRequest("Неверный формат запроса.");

        var category = categoryElement.GetString();
        if (string.IsNullOrWhiteSpace(category))
            return BadRequest("Категория обязательна.");

        if (!_context.Categories.Any(c => c.Name == category))
            return BadRequest("No such category.");

        switch (category)
        {
            case "Собственный дом":
                var houseDto = JsonSerializer.Deserialize<HouseAdDto>(request.GetRawText(),
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (houseDto == null) return BadRequest("Ошибка в данных.");
                return await CreateHouseAd(houseDto);

            default:
                return BadRequest($"Категория '{category}' не поддерживается.");
        }
    }

    [HttpPost("houseAd")]
    public async Task<IActionResult> CreateHouseAd(HouseAdDto dto)
    {
        Address? address = null;

        if (dto.Address != null)
        {
            address = await _context.Addresses
                .FirstOrDefaultAsync(a =>
                    a.Latitude == dto.Address.Latitude &&
                    a.Longitude == dto.Address.Longitude);

            if (address == null)
            {
                address = new Address
                {
                    DisplayName = dto.Address.DisplayName,
                    Latitude    = dto.Address.Latitude,
                    Longitude   = dto.Address.Longitude,
                    City        = dto.Address.City,
                    Street      = dto.Address.Street,
                    HouseNumber = dto.Address.HouseNumber,
                    PostalCode  = dto.Address.PostalCode,
                    Country     = dto.Address.Country,
                    State       = dto.Address.State
                };

                _context.Addresses.Add(address);
                await _context.SaveChangesAsync();
            }
        }

        var ad = new HouseAd
        {
            Title       = dto.Title,
            Description = dto.Description,
            ImageUrl    = dto.ImageUrl,
            Price       = dto.Price,
            Area        = dto.HouseArea,
            HouseArea   = dto.HouseArea,
            LandArea    = dto.LandArea,
            Floors      = dto.Floors,
            Rooms       = dto.Rooms,
            CategoryId  = new Guid(dto.CategoryId),
            AddressId   = address?.Id
        };

        _context.HouseAds.Add(ad);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created HouseAd {AdId}", ad.Id);

        return CreatedAtAction(nameof(GetAd), new { id = ad.Id }, ad);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAd(Guid id, Ad ad)
    {
        if (id != ad.Id) return BadRequest();
        _context.Entry(ad).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(ad);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchAd(Guid id, [FromBody] JsonPatchDocument<Ad> patchDoc)
    {
        if (patchDoc == null) return BadRequest();

        var ad = await _context.Ads.FindAsync(id);
        if (ad == null) return NotFound();

        patchDoc.ApplyTo(ad);

        if (!TryValidateModel(ad))
            return BadRequest(ModelState);

        _context.Entry(ad).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(ad);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAd(Guid id)
    {
        var ad = await _context.Ads.FindAsync(id);
        if (ad == null) return NotFound();
        _context.Ads.Remove(ad);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
