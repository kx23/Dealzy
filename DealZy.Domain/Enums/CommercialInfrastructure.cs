namespace DealZy.Domain.Enums;

[Flags]
public enum CommercialInfrastructure
{
    None = 0,
    CarWash = 1,
    Cafe = 2,
    BeautySalon = 4,
    CarService = 8,
    Cinema = 16,
    Storage = 32
}
