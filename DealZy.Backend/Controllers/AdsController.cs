using System.Text.Json;
using DealZy.Backend.Models;
using DealZy.Backend.Models.DTO.AdDTO;
using DealZy.Backend.Models.RealEstate;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace DealZy.Backend.Controllers
{
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

        // GET: api/ads - получить все объявления
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ad>>> GetAds()
        {
            return await _context.Ads.ToListAsync();
        }

        // GET: api/ads/{id} - получить объявление по ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Ad>> GetAd(string id)
        {
            var ad = await _context.Ads.FindAsync(new Guid(id));
            if (ad == null) return NotFound();
            return ad;
        }

        // POST: api/ads - создать объявление
        [HttpPost]
        [HttpPost]
        public async Task<IActionResult> CreateAd([FromBody] JsonElement request)
        {
            if (!request.TryGetProperty("categoryName", out var categoryElement))
            {
                return BadRequest("Неверный формат запроса. Ожидается { category, data }.");
            }

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
        
        
        private async Task<IActionResult> CreateHouseAd(HouseAdDto dto)
        {
            var category = _context.Categories.FirstOrDefault(c => c.Name == dto.CategoryName);
            var ad = new HouseAd
            {
                Title = dto.Title,
                Description= dto.Description,
                ImageUrl= dto.ImageUrl,
                Address = dto.Address,
                Price = dto.Price,
                Area = dto.HouseArea,
                HouseArea = dto.HouseArea,
                LandArea = dto.LandArea,
                Floors = dto.Floors,
                Rooms = dto.Rooms,
                CategoryId = category.Id
            };
            

            _context.HouseAds.Add(ad);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAd), new { id = ad.Id }, ad);
        }
        

        
        
        // PUT: api/ads/{id} - обновить объявление
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAd(string id, Ad ad)
        {
            if (id != ad.Id.ToString()) return BadRequest();

            _context.Entry(ad).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(ad);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchAd(Guid id, [FromBody] JsonPatchDocument<Ad> patchDoc)
        {
            if (patchDoc == null)
            {
                _logger.LogWarning("PATCH request failed: patchDoc is null.");
                return BadRequest();
            }

            var ad = await _context.Ads.FindAsync(id);
            if (ad == null)
            {
                _logger.LogWarning($"PATCH request failed: Ad with ID {id} not found.");
                return NotFound();
            }

            _logger.LogInformation($"PatchDoc JSON: {System.Text.Json.JsonSerializer.Serialize(patchDoc)}");

            // Логируем состояние объекта до изменений
            _logger.LogInformation($"Before PATCH: {System.Text.Json.JsonSerializer.Serialize(ad)}");

            patchDoc.ApplyTo(ad);

            if (!TryValidateModel(ad))
            {
                return BadRequest(ModelState);
            }

            // Логируем состояние объекта после изменений
            _logger.LogInformation($"After PATCH: {System.Text.Json.JsonSerializer.Serialize(ad)}");

            _context.Entry(ad).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _logger.LogInformation($"PATCH successful for Ad ID {id}");

            return Ok(ad);
        }



        // DELETE: api/ads/{id} - удалить объявление
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAd(string id)
        {
            var ad = await _context.Ads.FindAsync(id);
            if (ad == null) return NotFound();

            _context.Ads.Remove(ad);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
