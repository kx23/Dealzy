namespace DealZy.Domain.Enums;

[Flags]
public enum SuburbanUtilities
{
    None = 0,
    Electricity = 1,
    Gas = 2,
    WaterSupply = 4,
    Sewerage = 8
}
