using System.Security.Claims;
using DealZy.Domain.DTO.Requests;
using DealZy.Domain.Models;
using DealZy.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DealZy.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ICloudinaryService _cloudinaryService;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(
        UserManager<User> userManager,
        ICloudinaryService cloudinaryService,
        ILogger<ProfileController> logger)
    {
        _userManager = userManager;
        _cloudinaryService = cloudinaryService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return Unauthorized();

        return Ok(new
        {
            id = user.Id,
            name = user.UserName,
            email = user.Email,
            phoneNumber = user.PhoneNumber,
            avatarUrl = user.AvatarUrl,
            telegramNick = user.TelegramNick,
            contactName = user.ContactName,
            gender = user.Gender,
            dateOfBirth = user.DateOfBirth,
            accountType = user.AccountType,
            registeredAt = user.RegisteredAt
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var user = await GetCurrentUserAsync();
        if (user == null)
            return Unauthorized();

        if (request.AvatarUrl != null)
            user.AvatarUrl = request.AvatarUrl;

        if (request.PhoneNumber != null)
            user.PhoneNumber = request.PhoneNumber;

        if (request.TelegramNick != null)
            user.TelegramNick = request.TelegramNick;

        if (request.ContactName != null)
            user.ContactName = request.ContactName;

        if (request.Gender != null)
            user.Gender = request.Gender;

        if (request.DateOfBirth.HasValue)
            user.DateOfBirth = request.DateOfBirth;

        if (request.AccountType != null)
            user.AccountType = request.AccountType;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            _logger.LogWarning("Profile update failed for userId={UserId}: {Errors}",
                user.Id, string.Join(", ", result.Errors.Select(e => e.Description)));
            return BadRequest(result.Errors);
        }

        _logger.LogInformation("Profile updated for userId={UserId}", user.Id);
        return Ok(new
        {
            id = user.Id,
            name = user.UserName,
            email = user.Email,
            phoneNumber = user.PhoneNumber,
            avatarUrl = user.AvatarUrl,
            telegramNick = user.TelegramNick,
            contactName = user.ContactName,
            gender = user.Gender,
            dateOfBirth = user.DateOfBirth,
            accountType = user.AccountType
        });
    }

    [HttpPost("upload-avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Файл не выбран" });

        var user = await GetCurrentUserAsync();
        if (user == null)
            return Unauthorized();

        var avatarUrl = await _cloudinaryService.UploadImageAsync(file, "avatars");

        user.AvatarUrl = avatarUrl;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            _logger.LogWarning("Avatar update failed for userId={UserId}", user.Id);
            return BadRequest(new { message = "Ошибка при сохранении аватара" });
        }

        _logger.LogInformation("Avatar updated for userId={UserId}", user.Id);
        return Ok(new { url = avatarUrl });
    }

    private async Task<User?> GetCurrentUserAsync()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrEmpty(userId))
            return null;

        return await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }
}
