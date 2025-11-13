using Microsoft.AspNetCore.Mvc;
using DealZy.Backend.Models.Geocoding;
using DealZy.Backend.Services;

namespace DealZy.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeocodingController : ControllerBase
    {
        private readonly IGeocodingService _geocodingService;
        private readonly ILogger<GeocodingController> _logger;

        public GeocodingController(
            IGeocodingService geocodingService,
            ILogger<GeocodingController> logger)
        {
            _geocodingService = geocodingService;
            _logger = logger;
        }

        /// <summary>
        /// Search for addresses by query string
        /// </summary>
        /// <param name="query">Search query (e.g., "Москва, Тверская")</param>
        /// <returns>List of matching addresses with coordinates</returns>
        /// <response code="200">Returns list of addresses</response>
        /// <response code="400">If query is empty or invalid</response>
        [HttpGet("search")]
        [ProducesResponseType(typeof(List<AddressResult>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<AddressResult>>> Search([FromQuery] string query)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(query))
            {
                _logger.LogWarning("Empty query received");
                return BadRequest(new { error = "Query parameter cannot be empty" });
            }

            // Minimum length check (optional, but recommended)
            if (query.Length < 3)
            {
                _logger.LogWarning("Query too short: {Query}", query);
                return BadRequest(new { error = "Query must be at least 3 characters long" });
            }

            _logger.LogInformation("Geocoding search request: {Query}", query);

            try
            {
                var results = await _geocodingService.SearchAddressAsync(query);
                
                _logger.LogInformation("Returning {Count} results for query: {Query}", 
                    results.Count, query);
                
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing geocoding request: {Query}", query);
                return StatusCode(500, new { error = "Internal server error while searching address" });
            }
        }
    }
}