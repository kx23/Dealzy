using DealZy.Domain.DTO.AdDTO;
using DealZy.Domain.Enums;
using DealZy.Domain.Models;
using DealZy.Domain.Models.RealEstate;
using DealZy.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DealZy.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AdsController> _logger;

    public AdsController(ApplicationDbContext context, ILogger<AdsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdResponseDto>>> GetAds([FromQuery] DealType[]? dealType)
    {
        var query = _context.Ads.AsQueryable();

        if (dealType != null && dealType.Length > 0)
            query = query.Where(a => dealType.Contains(a.DealType));

        var ads = await query.ToListAsync();
        return Ok(ads.Select(a => new AdResponseDto
        {
            Id           = a.Id,
            Title        = a.Title,
            Description  = a.Description,
            Price        = a.Price,
            ImageUrl     = a.ImageUrl,
            DealType     = a.DealType,
            PropertyKind = a.GetType().Name.Replace("Ad", "")
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AdDetailDto>> GetAd(Guid id)
    {
        var ad = await _context.RealEstateAds
            .Include(a => a.Address)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (ad == null) return NotFound();

        return Ok(new AdDetailDto
        {
            Id           = ad.Id,
            Title        = ad.Title,
            Description  = ad.Description,
            Price        = ad.Price,
            ImageUrl     = ad.ImageUrl,
            DealType     = ad.DealType,
            PropertyKind = ad.GetType().Name.Replace("Ad", ""),
            Area         = ad.Area,
            SellerType   = ad.SellerType,
            Address      = ad.Address == null ? null : new AddressDto
            {
                DisplayName = ad.Address.DisplayName,
                Latitude    = ad.Address.Latitude,
                Longitude   = ad.Address.Longitude,
                City        = ad.Address.City,
                Street      = ad.Address.Street,
                HouseNumber = ad.Address.HouseNumber,
                PostalCode  = ad.Address.PostalCode,
                Country     = ad.Address.Country,
                State       = ad.Address.State
            }
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateAd([FromBody] CreateAdBaseDto dto)
    {
        return dto switch
        {
            CreateHouseAdDto     d => await SaveAd(MapHouse(d),     d),
            CreateApartmentAdDto d => await SaveAd(MapApartment(d), d),
            CreateRoomAdDto      d => await SaveAd(MapRoom(d),      d),
            CreateGarageAdDto    d => await SaveAd(MapGarage(d),    d),
            CreateLandPlotAdDto  d => await SaveAd(MapLandPlot(d),  d),
            CreateOfficeAdDto    d => await SaveAd(MapOffice(d),    d),
            CreateRetailAdDto    d => await SaveAd(MapRetail(d),    d),
            CreateWarehouseAdDto d => await SaveAd(MapWarehouse(d), d),
            CreateCoworkingAdDto d => await SaveAd(MapCoworking(d), d),
            _                      => BadRequest("Unknown property kind.")
        };
    }

    // --- mappers ---

    private static void MapBase(RealEstateAd ad, CreateAdBaseDto dto)
    {
        ad.Title          = dto.Title;
        ad.Description    = dto.Description;
        ad.ImageUrl       = dto.ImageUrl;
        ad.Price          = dto.Price;
        ad.DealType       = dto.DealType;
        ad.Area           = dto.Area;
        ad.SellerType     = dto.SellerType;
        ad.RentPeriod     = dto.RentPeriod;
        ad.Amenities      = dto.Amenities;
        ad.LivingConditions = dto.LivingConditions;
        ad.BathType       = dto.BathType;
        ad.NoDeposit      = dto.NoDeposit;
    }

    private static HouseAd MapHouse(CreateHouseAdDto dto)
    {
        var ad = new HouseAd
        {
            HouseArea        = dto.HouseArea,
            LandArea         = dto.LandArea,
            Floors           = dto.Floors,
            Rooms            = dto.Rooms,
            Bedrooms         = dto.Bedrooms,
            ConstructionYear = dto.ConstructionYear,
            PropertyType     = dto.PropertyType,
            HouseType        = dto.HouseType,
            Material         = dto.Material,
            LandStatus       = dto.LandStatus,
            Utilities        = dto.Utilities,
            HeatingType      = dto.HeatingType,
            BathroomInHouse  = dto.BathroomInHouse,
            OutdoorBathroom  = dto.OutdoorBathroom,
            HasBanya         = dto.HasBanya,
            HasGarage        = dto.HasGarage,
            HasSecurity      = dto.HasSecurity,
            HasPool          = dto.HasPool
        };
        MapBase(ad, dto);
        return ad;
    }

    private static ApartmentAd MapApartment(CreateApartmentAdDto dto)
    {
        var ad = new ApartmentAd
        {
            BuildingFloors        = dto.BuildingFloors,
            ApartmentFloor        = dto.ApartmentFloor,
            Rooms                 = dto.Rooms,
            KitchenArea           = dto.KitchenArea,
            LivingArea            = dto.LivingArea,
            ObjectType            = dto.ObjectType,
            BalconyType           = dto.BalconyType,
            IsApartments          = dto.IsApartments,
            ConstructionYear      = dto.ConstructionYear,
            RenovationType        = dto.RenovationType,
            BuildingType          = dto.BuildingType,
            CeilingHeight         = dto.CeilingHeight,
            ElevatorType          = dto.ElevatorType,
            BathroomType          = dto.BathroomType,
            HasMultipleBathrooms  = dto.HasMultipleBathrooms,
            WindowView            = dto.WindowView,
            ParkingType           = dto.ParkingType,
            IsShareSale           = dto.IsShareSale,
            HasRamp               = dto.HasRamp,
            IsWheelchairAccessible = dto.IsWheelchairAccessible
        };
        MapBase(ad, dto);
        return ad;
    }

    private static RoomAd MapRoom(CreateRoomAdDto dto)
    {
        var ad = new RoomAd
        {
            ApartmentFloor       = dto.ApartmentFloor,
            BuildingFloors       = dto.BuildingFloors,
            TotalRoomsInApartment = dto.TotalRoomsInApartment,
            RoomsForSale         = dto.RoomsForSale,
            CeilingHeight        = dto.CeilingHeight,
            BathroomType         = dto.BathroomType,
            HasMultipleBathrooms = dto.HasMultipleBathrooms,
            BalconyType          = dto.BalconyType,
            StoveType            = dto.StoveType,
            RenovationType       = dto.RenovationType,
            WindowView           = dto.WindowView,
            ConstructionYear     = dto.ConstructionYear,
            BuildingType         = dto.BuildingType,
            ElevatorType         = dto.ElevatorType,
            ParkingType          = dto.ParkingType,
            IsMortgagePossible   = dto.IsMortgagePossible,
            IsDemolitionBuilding = dto.IsDemolitionBuilding
        };
        MapBase(ad, dto);
        return ad;
    }

    private static GarageAd MapGarage(CreateGarageAdDto dto)
    {
        var ad = new GarageAd
        {
            GarageType      = dto.GarageType,
            OwnershipStatus = dto.OwnershipStatus,
            Utilities       = dto.Utilities,
            ParkingType     = dto.ParkingType
        };
        MapBase(ad, dto);
        return ad;
    }

    private static LandPlotAd MapLandPlot(CreateLandPlotAdDto dto)
    {
        var ad = new LandPlotAd
        {
            LandStatus = dto.LandStatus,
            Utilities  = dto.Utilities
        };
        MapBase(ad, dto);
        return ad;
    }

    private static OfficeAd MapOffice(CreateOfficeAdDto dto)
    {
        var ad = new OfficeAd
        {
            FloorMin         = dto.FloorMin,
            FloorMax         = dto.FloorMax,
            HasParking       = dto.HasParking,
            ConstructionYear = dto.ConstructionYear,
            BuildingFloors   = dto.BuildingFloors,
            Infrastructure   = dto.Infrastructure,
            ContractType     = dto.ContractType,
            CommissionType   = dto.CommissionType,
            FurnitureType    = dto.FurnitureType,
            Class            = dto.Class,
            BuildingType     = dto.BuildingType,
            AccessMode       = dto.AccessMode,
            Condition        = dto.Condition
        };
        MapBase(ad, dto);
        return ad;
    }

    private static RetailAd MapRetail(CreateRetailAdDto dto)
    {
        var ad = new RetailAd
        {
            FloorMin         = dto.FloorMin,
            FloorMax         = dto.FloorMax,
            HasParking       = dto.HasParking,
            ConstructionYear = dto.ConstructionYear,
            BuildingFloors   = dto.BuildingFloors,
            Infrastructure   = dto.Infrastructure,
            ContractType     = dto.ContractType,
            CommissionType   = dto.CommissionType,
            FurnitureType    = dto.FurnitureType,
            SpaceType        = dto.SpaceType,
            EntranceType     = dto.EntranceType,
            IsFirstLine      = dto.IsFirstLine,
            BuildingType     = dto.BuildingType,
            Condition        = dto.Condition
        };
        MapBase(ad, dto);
        return ad;
    }

    private static WarehouseAd MapWarehouse(CreateWarehouseAdDto dto)
    {
        var ad = new WarehouseAd
        {
            FloorMin         = dto.FloorMin,
            FloorMax         = dto.FloorMax,
            HasParking       = dto.HasParking,
            ConstructionYear = dto.ConstructionYear,
            BuildingFloors   = dto.BuildingFloors,
            Infrastructure   = dto.Infrastructure,
            ContractType     = dto.ContractType,
            CommissionType   = dto.CommissionType,
            FurnitureType    = dto.FurnitureType,
            Class            = dto.Class,
            BuildingType     = dto.BuildingType,
            Condition        = dto.Condition,
            HeatingType      = dto.HeatingType
        };
        MapBase(ad, dto);
        return ad;
    }

    private static CoworkingAd MapCoworking(CreateCoworkingAdDto dto)
    {
        var ad = new CoworkingAd
        {
            FloorMin         = dto.FloorMin,
            FloorMax         = dto.FloorMax,
            HasParking       = dto.HasParking,
            ConstructionYear = dto.ConstructionYear,
            BuildingFloors   = dto.BuildingFloors,
            Infrastructure   = dto.Infrastructure,
            ContractType     = dto.ContractType,
            CommissionType   = dto.CommissionType,
            FurnitureType    = dto.FurnitureType,
            Includes         = dto.Includes,
            Access           = dto.Access
        };
        MapBase(ad, dto);
        return ad;
    }

    // --- address upsert + save ---

    private async Task<IActionResult> SaveAd(RealEstateAd ad, CreateAdBaseDto dto)
    {
        if (dto.Address != null)
        {
            var address = await _context.Addresses
                .FirstOrDefaultAsync(a =>
                    a.Latitude == dto.Address.Latitude &&
                    a.Longitude == dto.Address.Longitude);

            if (address == null)
            {
                address = new Address
                {
                    DisplayName = dto.Address.DisplayName,
                    Latitude    = dto.Address.Latitude,
                    Longitude   = dto.Address.Longitude,
                    City        = dto.Address.City,
                    Street      = dto.Address.Street,
                    HouseNumber = dto.Address.HouseNumber,
                    PostalCode  = dto.Address.PostalCode,
                    Country     = dto.Address.Country,
                    State       = dto.Address.State
                };
                _context.Addresses.Add(address);
                await _context.SaveChangesAsync();
            }

            ad.AddressId = address.Id;
        }

        _context.Add(ad);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created {Kind} (DealType={DealType}) Id={Id}",
            ad.GetType().Name, ad.DealType, ad.Id);

        return CreatedAtAction(nameof(GetAd), new { id = ad.Id }, new { id = ad.Id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAd(Guid id)
    {
        var ad = await _context.Ads.FindAsync(id);
        if (ad == null) return NotFound();
        _context.Ads.Remove(ad);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
