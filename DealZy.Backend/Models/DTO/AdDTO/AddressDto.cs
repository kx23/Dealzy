using System.Text.Json.Serialization;

namespace DealZy.Backend.Models.DTO.AdDTO
{
    public class AddressDto
    {
        [JsonPropertyName("displayName")]
        public string DisplayName { get; set; }
        
        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }
        
        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }
        
        [JsonPropertyName("city")]
        public string City { get; set; }
        
        [JsonPropertyName("street")]
        public string Street { get; set; }
        
        [JsonPropertyName("houseNumber")]
        public string HouseNumber { get; set; }
        
        [JsonPropertyName("postalCode")]
        public string PostalCode { get; set; }
        
        [JsonPropertyName("country")]
        public string Country { get; set; }
        
        [JsonPropertyName("state")]
        public string State { get; set; }
    }
}