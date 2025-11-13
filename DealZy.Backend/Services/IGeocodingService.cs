using DealZy.Backend.Models.Geocoding;

namespace DealZy.Backend.Services
{
    public interface IGeocodingService
    {
        Task<List<AddressResult>> SearchAddressAsync(string query);
    }
}