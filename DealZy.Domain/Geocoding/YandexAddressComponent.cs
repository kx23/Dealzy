namespace DealZy.Domain.Geocoding;

public class YandexAddressComponent
{
    public string Name { get; set; }
    public List<string> Kind { get; set; } = new();
}
