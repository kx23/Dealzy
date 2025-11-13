namespace DealZy.Backend.Models.Geocoding
{
    public class NominatimAddress
    {
        public string Road { get; set; }
        public string HouseNumber { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Postcode { get; set; }
        public string State { get; set; }
        public string County { get; set; }
    }
}