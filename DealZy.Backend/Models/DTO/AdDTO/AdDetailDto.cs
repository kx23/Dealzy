// Models/DTO/AdDTO/AdDetailDto.cs
namespace DealZy.Backend.Models.DTO.AdDTO
{
    public class AdDetailDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        
        // Category info
        public string CategoryName { get; set; }
        
        // RealEstateAd fields
        public double? Area { get; set; }
        public string SellerType { get; set; }
        
        // HouseAd specific
        public double? HouseArea { get; set; }
        public double? LandArea { get; set; }
        public int? Floors { get; set; }
        public int? Rooms { get; set; }
        
        // Address
        public AddressDto Address { get; set; }
    }
    
}