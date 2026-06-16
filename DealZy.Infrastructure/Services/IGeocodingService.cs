using DealZy.Domain.Geocoding;

namespace DealZy.Infrastructure.Services;

public interface IGeocodingService
{
    Task<List<AddressResult>> SearchAddressAsync(string query);
    Task<List<AddressResult>> SearchCityAsync(string query);
    Task<List<AddressResult>> SearchStreetAsync(string query, string city);
    Task<AddressResult?> GeocodeByUriAsync(string uri);
    Task<AddressResult?> GeocodeByTextAsync(string text, double? llLon = null, double? llLat = null);
    Task<List<string>> GetDistrictsAsync(string cityName, double lon, double lat);
}
