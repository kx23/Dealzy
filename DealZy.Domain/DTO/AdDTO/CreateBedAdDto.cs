using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class CreateBedAdDto : CreateAdBaseDto
{
    public int ApartmentFloor { get; set; }
    public int BuildingFloors { get; set; }
    public int? BedsInRoom { get; set; }
    public BathroomType? BathroomType { get; set; }
    public RenovationType? RenovationType { get; set; }
    public BuildingType? BuildingType { get; set; }
    public ElevatorType? ElevatorType { get; set; }
    public int? ConstructionYear { get; set; }
}
