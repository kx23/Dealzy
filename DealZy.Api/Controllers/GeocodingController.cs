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

    [HttpGet("search-city")]
    [ProducesResponseType(typeof(List<AddressResult>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AddressResult>>> SearchCity([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            return BadRequest(new { error = "Query must be at least 2 characters long" });

        var results = await _geocodingService.SearchCityAsync(query);
        return Ok(results);
    }

    [HttpGet("search-street")]
    [ProducesResponseType(typeof(List<AddressResult>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AddressResult>>> SearchStreet([FromQuery] string query, [FromQuery] string city)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            return BadRequest(new { error = "Query must be at least 2 characters long" });
        if (string.IsNullOrWhiteSpace(city))
            return BadRequest(new { error = "City is required" });

        var results = await _geocodingService.SearchStreetAsync(query, city);
        return Ok(results);
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

    [HttpGet("geocode-by-text")]
    [ProducesResponseType(typeof(AddressResult), StatusCodes.Status200OK)]
    public async Task<ActionResult<AddressResult>> GeocodeByText([FromQuery] string query, [FromQuery] double? llLon = null, [FromQuery] double? llLat = null)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(new { error = "Query is required" });

        var result = await _geocodingService.GeocodeByTextAsync(query, llLon, llLat);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("districts")]
    [ProducesResponseType(typeof(List<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<string>>> GetDistricts([FromQuery] string cityName, [FromQuery] double lon, [FromQuery] double lat)
    {
        if (string.IsNullOrWhiteSpace(cityName))
            return BadRequest(new { error = "cityName is required" });

        var results = await _geocodingService.GetDistrictsAsync(cityName, lon, lat);
        return Ok(results);
    }

    [HttpGet("geocode")]
    [ProducesResponseType(typeof(AddressResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AddressResult>> Geocode([FromQuery] string uri)
    {
        if (string.IsNullOrWhiteSpace(uri))
            return BadRequest(new { error = "Uri is required" });

        try
        {
            var result = await _geocodingService.GeocodeByUriAsync(uri);
            if (result == null) return NotFound();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing geocode request: {Uri}", uri);
            return StatusCode(500, new { error = "Internal server error while geocoding" });
        }
    }
}
