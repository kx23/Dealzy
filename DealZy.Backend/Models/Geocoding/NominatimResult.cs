using System.Text.Json.Serialization;

namespace DealZy.Backend.Models.Geocoding
{
    public class NominatimResult
    {
        [JsonPropertyName("display_name")]
        public string DisplayName { get; set; }
        
        [JsonPropertyName("lat")]
        public string Lat { get; set; }
        
        [JsonPropertyName("lon")]
        public string Lon { get; set; }
        
        [JsonPropertyName("address")]
        public NominatimAddress Address { get; set; }
    }
}