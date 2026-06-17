namespace DealZy.Domain.DTO.Requests;

public class UpdateProfileRequest
{
    public string? AvatarUrl { get; set; }
    public string? PhoneNumber { get; set; }
    public string? TelegramNick { get; set; }
    public string? ContactName { get; set; }
    public string? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? AccountType { get; set; }
}
