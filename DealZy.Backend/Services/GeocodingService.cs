using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;
using DealZy.Backend.Models.Geocoding;

namespace DealZy.Backend.Services
{
    public class GeocodingService : IGeocodingService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly ILogger<GeocodingService> _logger;
        private const string NOMINATIM_URL = "https://nominatim.openstreetmap.org";

        public GeocodingService(
            HttpClient httpClient,
            IMemoryCache cache,
            ILogger<GeocodingService> logger)
        {
            _httpClient = httpClient;
            _cache = cache;
            _logger = logger;

            // OSM Nominatim REQUIRES User-Agent header, otherwise returns 403 error
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "DealZy/1.0");
        }

        public async Task<List<AddressResult>> SearchAddressAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<AddressResult>();

            // Normalize query for consistent caching
            var normalizedQuery = NormalizeQuery(query);
            var cacheKey = $"geocode_{normalizedQuery}";

            _logger.LogInformation("Searching address. Original: '{Original}', Normalized: '{Normalized}'",
                query, normalizedQuery);

            // Check cache
            if (_cache.TryGetValue<List<AddressResult>>(cacheKey, out var cachedResult))
            {
                _logger.LogInformation("✓ Address found in cache: {Query}", normalizedQuery);
                return cachedResult;
            }

            _logger.LogInformation("✗ Cache miss, fetching from OSM: {Query}", normalizedQuery);

            try
            {
                // Build URL for Nominatim request
                // format=json - get JSON response
                // addressdetails=1 - get detailed address information
                // limit=10 - maximum 10 results
                var url = $"{NOMINATIM_URL}/search?q={Uri.EscapeDataString(normalizedQuery)}&format=json&addressdetails=1&limit=10";

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var results = JsonSerializer.Deserialize<List<NominatimResult>>(content,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                // Convert Nominatim results to our format
                var addressResults = results?.Select(r => new AddressResult
                {
                    DisplayName = r.DisplayName,
                    Latitude = double.Parse(r.Lat, System.Globalization.CultureInfo.InvariantCulture),
                    Longitude = double.Parse(r.Lon, System.Globalization.CultureInfo.InvariantCulture),
                    Address = r.Address
                }).ToList() ?? new List<AddressResult>();

                // Cache result for 24 hours
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(24));

                _cache.Set(cacheKey, addressResults, cacheOptions);

                _logger.LogInformation("Found {Count} addresses, cached for 24 hours", addressResults.Count);

                return addressResults;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error searching address: {Query}", query);
                return new List<AddressResult>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching address: {Query}", query);
                return new List<AddressResult>();
            }
        }

        /// <summary>
        /// Normalizes query for better caching.
        /// Examples:
        /// "Москва, ул. Тверская" -> "москва улица тверская"
        /// "Москва  Тверская  ул." -> "москва улица тверская"
        /// </summary>
        private string NormalizeQuery(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return string.Empty;

            // 1. Convert to lowercase
            var normalized = query.ToLowerInvariant();

            // 2. Remove extra whitespace
            normalized = Regex.Replace(normalized, @"\s+", " ").Trim();

            // 3. Remove punctuation (commas, dots, hyphens)
            normalized = Regex.Replace(normalized, @"[,.\-;:]+", " ");

            // 4. Replace abbreviations with full forms
            var abbreviations = new Dictionary<string, string>
            {
                { @"\bул\b\.?", "улица" },
                { @"\bпр\b\.?", "проспект" },
                { @"\bпер\b\.?", "переулок" },
                { @"\bд\b\.?", "дом" },
                { @"\bкв\b\.?", "квартира" },
                { @"\bг\b\.?", "город" },
                { @"\bобл\b\.?", "область" },
                { @"\bстр\b\.?", "строение" },
                { @"\bкорп\b\.?", "корпус" },
            };

            foreach (var abbr in abbreviations)
            {
                normalized = Regex.Replace(normalized, abbr.Key, abbr.Value, RegexOptions.IgnoreCase);
            }

            // 5. Remove duplicate spaces after all replacements
            normalized = Regex.Replace(normalized, @"\s+", " ").Trim();

            return normalized;
        }
    }
}