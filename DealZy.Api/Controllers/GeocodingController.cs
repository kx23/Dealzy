using DealZy.Domain.Geocoding;
using DealZy.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace DealZy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GeocodingController : ControllerBase
{
    private readonly IGeocodingService _geocodingService;
    private readonly ILogger<GeocodingController> _logger;

    public GeocodingController(IGeocodingService geocodingService, ILogger<GeocodingController> logger)
    {
        _geocodingService = geocodingService;
        _logger = logger;
    }

    [HttpGet("search")]
    [ProducesResponseType(typeof(List<AddressResult>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<AddressResult>>> Search([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 3)
            return BadRequest(new { error = "Query must be at least 3 characters long" });

        try
        {
            var results = await _geocodingService.SearchAddressAsync(query);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing geocoding request: {Query}", query);
            return StatusCode(500, new { error = "Internal server error while searching address" });
        }
    }
}
