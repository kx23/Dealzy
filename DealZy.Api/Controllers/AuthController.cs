using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using DealZy.Domain.Models;
using DealZy.Infrastructure.Data;
using DealZy.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace DealZy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AuthController> _logger;
    private readonly IEmailService _emailService;

    public AuthController(
        UserManager<User> userManager,
        IConfiguration configuration,
        ApplicationDbContext context,
        ILogger<AuthController> logger,
        IEmailService emailService)
    {
        _userManager = userManager;
        _configuration = configuration;
        _context = context;
        _logger = logger;
        _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new User
        {
            UserName = request.Name,
            Email = request.Email,
            RegisteredAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            _logger.LogWarning("Registration failed for email={Email}: {Errors}",
                request.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
            return BadRequest(result.Errors);
        }

#if !DEBUG
        await SendConfirmationEmailAsync(user);
#endif

        _logger.LogInformation("User registered: userId={UserId} email={Email}", user.Id, user.Email);
        return Ok(new { message = "Регистрация успешна. Проверьте почту для подтверждения аккаунта." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            _logger.LogWarning("Login failed for email={Email}", request.Email);
            return Unauthorized(new { message = "Неверный email или пароль" });
        }

#if !DEBUG
        if (!user.EmailConfirmed)
        {
            return StatusCode(403, new { message = "EMAIL_NOT_CONFIRMED" });
        }
#endif

        _logger.LogInformation("User logged in: userId={UserId} email={Email}", user.Id, user.Email);
        var accessToken = GenerateAccessToken(user);
        var refreshToken = await GenerateRefreshToken(user);
        SetRefreshTokenCookie(refreshToken.Token);
        return Ok(new { token = accessToken, userId = user.Id, name = user.UserName });
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
    {
        var frontendUrl = _configuration["Frontend:Url"]!;

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Redirect($"{frontendUrl}/confirm-email?success=false&reason=not_found");

        var result = await _userManager.ConfirmEmailAsync(user, token);
        if (!result.Succeeded)
        {
            _logger.LogWarning("Email confirmation failed for userId={UserId}", userId);
            return Redirect($"{frontendUrl}/confirm-email?success=false&reason=invalid_token");
        }

        _logger.LogInformation("Email confirmed for userId={UserId}", userId);
        return Redirect($"{frontendUrl}/confirm-email?success=true");
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var rawToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(rawToken))
            return Unauthorized(new { message = "No refresh token" });

        var stored = await _context.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == rawToken);

        if (stored == null || !stored.IsActive)
            return Unauthorized(new { message = "Invalid or expired refresh token" });

        stored.RevokedAt = DateTime.UtcNow;
        var newRefresh = await GenerateRefreshToken(stored.User);
        SetRefreshTokenCookie(newRefresh.Token);

        var accessToken = GenerateAccessToken(stored.User);
        return Ok(new { token = accessToken });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var rawToken = Request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(rawToken))
        {
            var stored = await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == rawToken);
            if (stored != null && stored.IsActive)
            {
                stored.RevokedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        Response.Cookies.Delete("refreshToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/api/auth"
        });

        return Ok();
    }

    private async Task SendConfirmationEmailAsync(User user)
    {
        try
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var apiUrl = _configuration["Api:Url"]!;
            var confirmLink = $"{apiUrl}/api/auth/confirm-email?userId={user.Id}&token={HttpUtility.UrlEncode(token)}";
            await _emailService.SendEmailConfirmationAsync(user.Email!, user.UserName!, confirmLink);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Failed to send confirmation email to {Email}: {Message}", user.Email, ex.Message);
        }
    }

    private string GenerateAccessToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpireMinutes"]!)),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<RefreshToken> GenerateRefreshToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var days = int.Parse(jwtSettings["RefreshTokenExpirationDays"] ?? "30");

        var refreshToken = new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(days)
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();
        return refreshToken;
    }

    private void SetRefreshTokenCookie(string token)
    {
        var days = int.Parse(_configuration.GetSection("Jwt")["RefreshTokenExpirationDays"] ?? "30");
        Response.Cookies.Append("refreshToken", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/api/auth",
            Expires = DateTimeOffset.UtcNow.AddDays(days)
        });
    }
}

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Name, string Email, string Password);
