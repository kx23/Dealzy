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
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
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

    public async Task<List<string>> GetDistrictsAsync(string cityName, double lon, double lat)
    {
        var cacheKey = $"districts_{cityName.ToLowerInvariant().Trim()}";
        if (_cache.TryGetValue<List<string>>(cacheKey, out var cached)) return cached!;

        try
        {
            var inv = System.Globalization.CultureInfo.InvariantCulture;
            var ll = $"{lon.ToString(inv)},{lat.ToString(inv)}";
            var url = $"{GeocoderUrl}?apikey={_geocoderApiKey}&geocode={Uri.EscapeDataString(cityName)}&kind=district&results=50&rspn=1&ll={ll}&spn=0.5,0.5&format=json&lang=ru_RU";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var geoResponse = JsonSerializer.Deserialize<YandexGeocoderResponse>(content, JsonOptions);

            var districts = geoResponse?.Response?.GeoObjectCollection?.FeatureMember?
                .Select(m => m.GeoObject?.MetaDataProperty?.GeocoderMetaData?.Text)
                .Where(t => !string.IsNullOrEmpty(t))
                .Select(t => t!.Split(',').Last().Trim())
                .Distinct()
                .OrderBy(t => t)
                .ToList() ?? new List<string>();

            _cache.Set(cacheKey, districts, new MemoryCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(6)));
            return districts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GetDistricts error for city: {City}", cityName);
            return new List<string>();
        }
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

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
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
