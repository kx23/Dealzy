namespace DealZy.Domain.Enums;

[Flags]
public enum GarageUtilities
{
    None = 0,
    Electricity = 1,
    Water = 2,
    Heating = 4,
    FireSuppression = 8
}
