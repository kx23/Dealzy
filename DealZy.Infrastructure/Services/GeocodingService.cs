using System.Text.Json;
using System.Text.RegularExpressions;
using DealZy.Domain.Geocoding;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace DealZy.Infrastructure.Services;

public class GeocodingService : IGeocodingService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly ILogger<GeocodingService> _logger;
    private const string NominatimUrl = "https://nominatim.openstreetmap.org";

    public GeocodingService(HttpClient httpClient, IMemoryCache cache, ILogger<GeocodingService> logger)
    {
        _httpClient = httpClient;
        _cache = cache;
        _logger = logger;
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "DealZy/1.0");
    }

    public async Task<List<AddressResult>> SearchAddressAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new List<AddressResult>();

        var normalizedQuery = NormalizeQuery(query);
        var cacheKey = $"geocode_{normalizedQuery}";

        if (_cache.TryGetValue<List<AddressResult>>(cacheKey, out var cached))
            return cached!;

        try
        {
            var url = $"{NominatimUrl}/search?q={Uri.EscapeDataString(normalizedQuery)}&format=json&addressdetails=1&limit=10";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var results = JsonSerializer.Deserialize<List<NominatimResult>>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            var addressResults = results?.Select(r => new AddressResult
            {
                DisplayName = r.DisplayName,
                Latitude    = double.Parse(r.Lat, System.Globalization.CultureInfo.InvariantCulture),
                Longitude   = double.Parse(r.Lon, System.Globalization.CultureInfo.InvariantCulture),
                Address     = r.Address
            }).ToList() ?? new List<AddressResult>();

            _cache.Set(cacheKey, addressResults, new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24)));

            return addressResults;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching address: {Query}", query);
            return new List<AddressResult>();
        }
    }

    private static string NormalizeQuery(string query)
    {
        var normalized = query.ToLowerInvariant();
        normalized = Regex.Replace(normalized, @"\s+", " ").Trim();
        normalized = Regex.Replace(normalized, @"[,.\-;:]+", " ");

        var abbreviations = new Dictionary<string, string>
        {
            { @"\bул\b\.?",   "улица" },
            { @"\bпр\b\.?",   "проспект" },
            { @"\bпер\b\.?",  "переулок" },
            { @"\bд\b\.?",    "дом" },
            { @"\bкв\b\.?",   "квартира" },
            { @"\bг\b\.?",    "город" },
            { @"\bобл\b\.?",  "область" },
            { @"\bстр\b\.?",  "строение" },
            { @"\bкорп\b\.?", "корпус" },
        };

        foreach (var (pattern, replacement) in abbreviations)
            normalized = Regex.Replace(normalized, pattern, replacement, RegexOptions.IgnoreCase);

        return Regex.Replace(normalized, @"\s+", " ").Trim();
    }
}
