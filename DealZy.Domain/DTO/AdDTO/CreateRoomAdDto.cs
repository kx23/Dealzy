using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class CreateRoomAdDto : CreateAdBaseDto
{
    public int ApartmentFloor { get; set; }
    public int BuildingFloors { get; set; }
    public int? TotalRoomsInApartment { get; set; }
    public int? RoomsForSale { get; set; }
    public double? CeilingHeight { get; set; }
    public BathroomType? BathroomType { get; set; }
    public bool? HasMultipleBathrooms { get; set; }
    public BalconyType? BalconyType { get; set; }
    public StoveType? StoveType { get; set; }
    public RenovationType? RenovationType { get; set; }
    public WindowView? WindowView { get; set; }
    public int? ConstructionYear { get; set; }
    public BuildingType? BuildingType { get; set; }
    public ElevatorType? ElevatorType { get; set; }
    public ParkingType? ParkingType { get; set; }
    public bool? IsMortgagePossible { get; set; }
    public bool? IsDemolitionBuilding { get; set; }
}
