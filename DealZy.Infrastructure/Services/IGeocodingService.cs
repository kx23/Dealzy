using DealZy.Domain.Geocoding;

namespace DealZy.Infrastructure.Services;

public interface IGeocodingService
{
    Task<List<AddressResult>> SearchAddressAsync(string query);
}
