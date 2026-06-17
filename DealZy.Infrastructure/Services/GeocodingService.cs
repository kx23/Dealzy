using System.Text.Json;
using System.Text.Json.Serialization;
using DealZy.Domain.Geocoding;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DealZy.Infrastructure.Services;

public class GeocodingService : IGeocodingService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly ILogger<GeocodingService> _logger;
    private readonly string _geocoderApiKey;
    private readonly string _suggestApiKey;

    private const string SuggestUrl = "https://suggest-maps.yandex.ru/v1/suggest";
    private const string GeocoderUrl = "https://geocode-maps.yandex.ru/v1/";

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public GeocodingService(HttpClient httpClient, IMemoryCache cache, ILogger<GeocodingService> logger, IConfiguration config)
    {
        _httpClient = httpClient;
        _cache = cache;
        _logger = logger;
        _geocoderApiKey = config["Yandex:GeocoderApiKey"]!;
        _suggestApiKey = config["Yandex:SuggestApiKey"]!;
    }

    public async Task<List<AddressResult>> SearchAddressAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return new List<AddressResult>();

        var cacheKey = $"suggest_{query.ToLowerInvariant().Trim()}";
        if (_cache.TryGetValue<List<AddressResult>>(cacheKey, out var cached))
            return cached!;

        try
        {
            var url = $"{SuggestUrl}?apikey={_suggestApiKey}&text={Uri.EscapeDataString(query)}&lang=ru&results=7&print_address=1&attrs=uri&types=house,street";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var suggestResponse = JsonSerializer.Deserialize<YandexSuggestResponse>(content, JsonOptions);

            var results = suggestResponse?.Results?
                .Select(r => new AddressResult
                {
                    DisplayName = r.Title?.Text ?? string.Empty,
                    Uri = r.Uri ?? string.Empty,
                    Components = r.Address?.Component?
                        .Select(c => new YandexAddressComponent { Name = c.Name, Kind = c.Kind })
                        .ToList() ?? new List<YandexAddressComponent>()
                })
                .Where(r => !string.IsNullOrEmpty(r.Uri))
                .ToList() ?? new List<AddressResult>();

            _cache.Set(cacheKey, results, new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(1)));

            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Suggest error for query: {Query}", query);
            return new List<AddressResult>();
        }
    }

    public async Task<List<AddressResult>> SearchCityAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query)) return new List<AddressResult>();

        var cacheKey = $"city_{query.ToLowerInvariant().Trim()}";
        if (_cache.TryGetValue<List<AddressResult>>(cacheKey, out var cached)) return cached!;

        try
        {
            var url = $"{SuggestUrl}?apikey={_suggestApiKey}&text={Uri.EscapeDataString(query)}&lang=ru&results=7&print_address=1&attrs=uri&types=locality&bbox=19.6,41.2,191.0,81.9&strict_bounds=1";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var suggestResponse = JsonSerializer.Deserialize<YandexSuggestResponse>(content, JsonOptions);

            var results = suggestResponse?.Results?
                .Select(r => new AddressResult
                {
                    DisplayName = r.Title?.Text ?? string.Empty,
                    Uri = r.Uri ?? string.Empty,
                    Components = r.Address?.Component?
                        .Select(c => new YandexAddressComponent { Name = c.Name, Kind = c.Kind })
                        .ToList() ?? new List<YandexAddressComponent>()
                })
                .Where(r => !string.IsNullOrEmpty(r.Uri))
                .ToList() ?? new List<AddressResult>();

            _cache.Set(cacheKey, results, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(1)));
            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "City suggest error for query: {Query}", query);
            return new List<AddressResult>();
        }
    }

    public async Task<List<AddressResult>> SearchStreetAsync(string query, string city)
    {
        if (string.IsNullOrWhiteSpace(query) || string.IsNullOrWhiteSpace(city)) return new List<AddressResult>();

        var cacheKey = $"street_{city.ToLowerInvariant().Trim()}_{query.ToLowerInvariant().Trim()}";
        if (_cache.TryGetValue<List<AddressResult>>(cacheKey, out var cached)) return cached!;

        try
        {
            var fullQuery = $"{city} {query}";
            var url = $"{SuggestUrl}?apikey={_suggestApiKey}&text={Uri.EscapeDataString(fullQuery)}&lang=ru&results=7&print_address=1&attrs=uri&types=street,house";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var suggestResponse = JsonSerializer.Deserialize<YandexSuggestResponse>(content, JsonOptions);

            var results = suggestResponse?.Results?
                .Select(r => new AddressResult
                {
                    DisplayName = r.Title?.Text ?? string.Empty,
                    Uri = r.Uri ?? string.Empty,
                    Components = r.Address?.Component?
                        .Select(c => new YandexAddressComponent { Name = c.Name, Kind = c.Kind })
                        .ToList() ?? new List<YandexAddressComponent>()
                })
                .Where(r => !string.IsNullOrEmpty(r.Uri))
                .ToList() ?? new List<AddressResult>();

            _cache.Set(cacheKey, results, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(10)));
            return results;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Street suggest error for query: {Query} city: {City}", query, city);
            return new List<AddressResult>();
        }
    }

    public async Task<AddressResult?> GeocodeByUriAsync(string uri)
    {
        var cacheKey = $"geocode_{uri}";
        if (_cache.TryGetValue<AddressResult>(cacheKey, out var cached))
            return cached;

        try
        {
            var url = $"{GeocoderUrl}?apikey={_geocoderApiKey}&geocode={Uri.EscapeDataString(uri)}&format=json&lang=ru_RU&results=1";
            var content = await CallGeocoderWithLoggingAsync(url, "Geocode by URI");
            var geoResponse = JsonSerializer.Deserialize<YandexGeocoderResponse>(content, JsonOptions);

            var member = geoResponse?.Response?.GeoObjectCollection?.FeatureMember?.FirstOrDefault();
            if (member?.GeoObject == null) return null;

            var pos = member.GeoObject.Point?.Pos?.Split(' ');
            if (pos == null || pos.Length < 2) return null;

            // Geocoder returns "lon lat"
            var lon = double.Parse(pos[0], System.Globalization.CultureInfo.InvariantCulture);
            var lat = double.Parse(pos[1], System.Globalization.CultureInfo.InvariantCulture);

            var address = member.GeoObject.MetaDataProperty?.GeocoderMetaData?.Address;
            var components = address?.Components?
                .Select(c => new YandexAddressComponent { Name = c.Name, Kind = new List<string> { c.Kind } })
                .ToList() ?? new List<YandexAddressComponent>();

            var result = new AddressResult
            {
                DisplayName = member.GeoObject.MetaDataProperty?.GeocoderMetaData?.Text ?? string.Empty,
                Latitude = lat,
                Longitude = lon,
                Uri = uri,
                Components = components
            };

            _cache.Set(cacheKey, result, new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24)));

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Geocode error for uri: {Uri}", uri);
            return null;
        }
    }

    public async Task<List<string>> GetDistrictsAsync(string cityName)
    {
        if (string.IsNullOrWhiteSpace(cityName)) return new List<string>();

        var cacheKey = $"districts_{cityName.ToLowerInvariant().Trim()}";
        if (_cache.TryGetValue<List<string>>(cacheKey, out var cached)) return cached!;

        try
        {
            var inv = System.Globalization.CultureInfo.InvariantCulture;

            // Step 1: Geocode city name to get its center and bounding box
            _logger.LogInformation("=== Step 1: Geocoding city '{CityName}' to get center and bounding box ===", cityName);

            var cityUrl = $"{GeocoderUrl}?apikey={_geocoderApiKey}&geocode={Uri.EscapeDataString(cityName)}&kind=locality&results=1&format=json&lang=ru_RU";
            var cityJson = await CallGeocoderWithLoggingAsync(cityUrl, "City geocoding");

            var cityGeoResponse = JsonSerializer.Deserialize<YandexGeocoderResponse>(cityJson, JsonOptions);
            var member = cityGeoResponse?.Response?.GeoObjectCollection?.FeatureMember?.FirstOrDefault();

            if (member?.GeoObject?.BoundedBy?.Envelope == null || member.GeoObject.Point?.Pos == null)
            {
                _logger.LogWarning("Could not determine position or bounding box for city: {CityName}", cityName);
                return new List<string>();
            }

            var env = member.GeoObject.BoundedBy.Envelope;
            var lowerParts = env.LowerCorner?.Split(' ');
            var upperParts = env.UpperCorner?.Split(' ');
            var centerParts = member.GeoObject.Point.Pos.Split(' ');

            if (lowerParts == null || lowerParts.Length < 2 || upperParts == null || upperParts.Length < 2 || centerParts.Length < 2)
            {
                _logger.LogWarning("Invalid position/bounding box format for city: {CityName}", cityName);
                return new List<string>();
            }

            var centerLon = double.Parse(centerParts[0], inv);
            var centerLat = double.Parse(centerParts[1], inv);
            var lowerLon = double.Parse(lowerParts[0], inv);
            var lowerLat = double.Parse(lowerParts[1], inv);
            var upperLon = double.Parse(upperParts[0], inv);
            var upperLat = double.Parse(upperParts[1], inv);

            var spnLon = (upperLon - lowerLon).ToString(inv);
            var spnLat = (upperLat - lowerLat).ToString(inv);
            var ll = $"{centerLon.ToString(inv)},{centerLat.ToString(inv)}";
            _logger.LogInformation("City center: {Ll}, spn: {SpnLon},{SpnLat}", ll, spnLon, spnLat);

            // Step 2: Query districts with ll+spn and kind=district
            // Note: spn is NOT ignored here because geocode contains city NAME (text), not coordinates
            _logger.LogInformation("=== Step 2: Fetching districts with ll+spn ===");

            var districtsUrl = $"{GeocoderUrl}?apikey={_geocoderApiKey}&geocode={Uri.EscapeDataString(cityName)}&ll={ll}&spn={spnLon},{spnLat}&kind=district&rspn=1&results=50&format=json&lang=ru_RU";
            var districtsJson = await CallGeocoderWithLoggingAsync(districtsUrl, "Districts by bbox");

            var districtsGeoResponse = JsonSerializer.Deserialize<YandexGeocoderResponse>(districtsJson, JsonOptions);

            var districts = districtsGeoResponse?.Response?.GeoObjectCollection?.FeatureMember?
                .Select(m => m.GeoObject?.MetaDataProperty?.GeocoderMetaData?.Text)
                .Where(t => !string.IsNullOrEmpty(t))
                .Select(t => t!.Split(',').Last().Trim())
                .Distinct()
                .OrderBy(t => t)
                .ToList() ?? new List<string>();

            _cache.Set(cacheKey, districts, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(6)));

            _logger.LogInformation("Found {Count} districts for city '{CityName}': {Districts}",
                districts.Count, cityName, string.Join(", ", districts));

            return districts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GetDistricts error for city: {City}", cityName);
            return new List<string>();
        }
    }

    private async Task<string> CallGeocoderWithLoggingAsync(string url, string description)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        var response = await _httpClient.SendAsync(request);

        var safeUrl = url.Replace(_geocoderApiKey, "***");
        _logger.LogInformation("[{Desc}] Request URL: {Url}", description, safeUrl);

        if (request.Headers.Any())
        {
            _logger.LogInformation("[{Desc}] Request headers: {Headers}", description,
                string.Join("; ", request.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value)}")));
        }

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        _logger.LogInformation("[{Desc}] Response ({Status}): {Body}", description,
            (int)response.StatusCode, content);

        return content;
    }

    public async Task<AddressResult?> GeocodeByTextAsync(string text, double? llLon = null, double? llLat = null)
    {
        var cacheKey = $"geocode_text_{text.ToLowerInvariant().Trim()}_{llLon}_{llLat}";
        if (_cache.TryGetValue<AddressResult>(cacheKey, out var cached))
            return cached;

        try
        {
            var url = $"{GeocoderUrl}?apikey={_geocoderApiKey}&geocode={Uri.EscapeDataString(text)}&format=json&lang=ru_RU&results=1";
            if (llLon.HasValue && llLat.HasValue)
                url += $"&ll={llLon.Value.ToString(System.Globalization.CultureInfo.InvariantCulture)},{llLat.Value.ToString(System.Globalization.CultureInfo.InvariantCulture)}&spn=0.5,0.5&rspn=1";

            var content = await CallGeocoderWithLoggingAsync(url, "Geocode by text");
            var geoResponse = JsonSerializer.Deserialize<YandexGeocoderResponse>(content, JsonOptions);

            var member = geoResponse?.Response?.GeoObjectCollection?.FeatureMember?.FirstOrDefault();
            if (member?.GeoObject == null) return null;

            var pos = member.GeoObject.Point?.Pos?.Split(' ');
            if (pos == null || pos.Length < 2) return null;

            var lon = double.Parse(pos[0], System.Globalization.CultureInfo.InvariantCulture);
            var lat = double.Parse(pos[1], System.Globalization.CultureInfo.InvariantCulture);

            var address = member.GeoObject.MetaDataProperty?.GeocoderMetaData?.Address;
            var components = address?.Components?
                .Select(c => new YandexAddressComponent { Name = c.Name, Kind = new List<string> { c.Kind } })
                .ToList() ?? new List<YandexAddressComponent>();

            var result = new AddressResult
            {
                DisplayName = member.GeoObject.MetaDataProperty?.GeocoderMetaData?.Text ?? string.Empty,
                Latitude = lat,
                Longitude = lon,
                Components = components
            };

            _cache.Set(cacheKey, result, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(24)));
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GeocodeByText error for: {Text}", text);
            return null;
        }
    }

    // --- Suggest response models ---

    private class YandexSuggestResponse
    {
        public List<SuggestResult>? Results { get; set; }
    }

    private class SuggestResult
    {
        public SuggestTitle? Title { get; set; }
        public SuggestAddress? Address { get; set; }
        public string? Uri { get; set; }
    }

    private class SuggestTitle
    {
        public string? Text { get; set; }
    }

    private class SuggestAddress
    {
        [JsonPropertyName("formatted_address")]
        public string? FormattedAddress { get; set; }
        public List<SuggestComponent>? Component { get; set; }
    }

    private class SuggestComponent
    {
        public string Name { get; set; } = string.Empty;
        public List<string> Kind { get; set; } = new();
    }

    // --- Geocoder response models ---

    private class YandexGeocoderResponse
    {
        public GeocoderResponseWrapper? Response { get; set; }
    }

    private class GeocoderResponseWrapper
    {
        public GeoObjectCollection? GeoObjectCollection { get; set; }
    }

    private class GeoObjectCollection
    {
        public List<FeatureMember>? FeatureMember { get; set; }
    }

    private class FeatureMember
    {
        public GeoObject? GeoObject { get; set; }
    }

    private class GeoObject
    {
        public GeoObjectMetaDataProperty? MetaDataProperty { get; set; }
        public GeoPoint? Point { get; set; }
        public BoundedBy? BoundedBy { get; set; }
    }

    private class BoundedBy
    {
        public Envelope? Envelope { get; set; }
    }

    private class Envelope
    {
        public string? LowerCorner { get; set; }
        public string? UpperCorner { get; set; }
    }

    private class GeoObjectMetaDataProperty
    {
        public GeocoderMetaData? GeocoderMetaData { get; set; }
    }

    private class GeocoderMetaData
    {
        public string? Text { get; set; }
        public GeocoderAddress? Address { get; set; }
    }

    private class GeocoderAddress
    {
        public List<GeocoderComponent>? Components { get; set; }
    }

    private class GeocoderComponent
    {
        public string Kind { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    private class GeoPoint
    {
        public string? Pos { get; set; }
    }
}
