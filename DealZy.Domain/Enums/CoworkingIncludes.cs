namespace DealZy.Domain.Enums;

[Flags]
public enum CoworkingIncludes
{
    None = 0,
    WiFi = 1 << 0,
    Parking = 1 << 1,
    Fax = 1 << 2,
    BikeParking = 1 << 3,
    MeetingRooms = 1 << 4,
    Flipchart = 1 << 5,
    HighSpeedInternet = 1 << 6,
    PrinterScanner = 1 << 7,
    FruitsSnacks = 1 << 8,
    RelaxZones = 1 << 9,
    Reception = 1 << 10,
    ModernRepair = 1 << 11,
    TeaCoffee = 1 << 12,
    Lockers = 1 << 13,
    Cleaning = 1 << 14,
    Gym = 1 << 15,
    LegalAddress = 1 << 16,
    Kitchen = 1 << 17,
    PhoneBooths = 1 << 18,
    TechSupport = 1 << 19,
    Furniture = 1 << 20,
    Security = 1 << 21,
    EventParticipation = 1 << 22,
    Cafe = 1 << 23
}
