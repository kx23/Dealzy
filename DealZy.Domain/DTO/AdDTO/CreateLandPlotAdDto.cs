using DealZy.Domain.Enums;

namespace DealZy.Domain.DTO.AdDTO;

public class CreateLandPlotAdDto : CreateAdBaseDto
{
    public LandStatus? LandStatus { get; set; }
    public SuburbanUtilities? Utilities { get; set; }
}
