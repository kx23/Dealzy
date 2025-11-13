namespace DealZy.Backend.Models.Geocoding
{
    public class AddressResult
    {
        public string DisplayName { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public NominatimAddress Address { get; set; }
    }
}