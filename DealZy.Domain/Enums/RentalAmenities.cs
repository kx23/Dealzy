namespace DealZy.Domain.Enums;

[Flags]
public enum RentalAmenities
{
    None = 0,
    AirConditioning = 1,
    Fridge = 2,
    Dishwasher = 4,
    WashingMachine = 8,
    NoFurniture = 16,
    RoomFurniture = 32,
    KitchenFurniture = 64,
    Internet = 128,
    Phone = 256,
    TV = 512
}
