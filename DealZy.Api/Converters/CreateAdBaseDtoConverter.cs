using DealZy.Domain.DTO.AdDTO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DealZy.Api.Converters;

public class CreateAdBaseDtoConverter : JsonConverter<CreateAdBaseDto>
{
    public override bool CanWrite => false;

    public override CreateAdBaseDto? ReadJson(
        JsonReader reader, Type objectType, CreateAdBaseDto? existingValue,
        bool hasExistingValue, JsonSerializer serializer)
    {
        var jo = JObject.Load(reader);
        var kind = jo["propertyKind"]?.Value<string>();

        CreateAdBaseDto dto = kind switch
        {
            "house"     => new CreateHouseAdDto(),
            "apartment" => new CreateApartmentAdDto(),
            "room"      => new CreateRoomAdDto(),
            "garage"    => new CreateGarageAdDto(),
            "landPlot"  => new CreateLandPlotAdDto(),
            "office"    => new CreateOfficeAdDto(),
            "retail"    => new CreateRetailAdDto(),
            "warehouse" => new CreateWarehouseAdDto(),
            "coworking" => new CreateCoworkingAdDto(),
            _ => throw new JsonSerializationException($"Unknown propertyKind: '{kind}'")
        };

        serializer.Populate(jo.CreateReader(), dto);
        return dto;
    }

    public override void WriteJson(JsonWriter writer, CreateAdBaseDto? value, JsonSerializer serializer)
        => throw new NotSupportedException();
}
