using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using DealZy.Backend.Models.DTO.Requests;
using DealZy.Backend.Models;

namespace DealZy.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (model.Password != model.ConfirmPassword)
                return BadRequest("Passwords do not match.");

            // Проверка на уникальность email
            if (await _userManager.FindByEmailAsync(model.Email) != null)
                return BadRequest("Email is already in use.");

            // Проверка на уникальность username
            if (await _userManager.FindByNameAsync(model.UserName) != null)
                return BadRequest("Username is already taken.");

            var user = new User
            {
                Email = model.Email,
                UserName = model.UserName
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
                return Ok("User registered successfully.");

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest("Invalid email or password.");

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);

            if (result.Succeeded)
                return Ok("Login successful.");

            return BadRequest("Invalid email or password.");
        }
    }
}
