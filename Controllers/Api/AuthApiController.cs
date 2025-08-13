using System.Linq;
using System.Threading.Tasks;
using Asrati.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Asrati.Controllers.Api
{
    [ApiController]
    [Route("api/auth")]
    public class AuthApiController : ControllerBase
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AuthApiController(SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        public class LoginRequest
        {
            public string PhoneNumber { get; set; }
            public string Password { get; set; }
            public bool RememberMe { get; set; }
        }

        public class RegisterRequest
        {
            public string PhoneNumber { get; set; }
            public string UserName { get; set; }
            public string Password { get; set; }
        }

        public class ChangePasswordRequestDto
        {
            public string PhoneNumber { get; set; }
        }

        public class ChangePasswordDto
        {
            public string PhoneNumber { get; set; }
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.PhoneNumber) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "رقم الهاتف وكلمة المرور مطلوبة" });
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);
            if (user == null)
            {
                return Unauthorized(new { message = "المستخدم غير موجود" });
            }

            var result = await _signInManager.PasswordSignInAsync(user, request.Password, request.RememberMe, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "بيانات الدخول غير صحيحة" });
            }

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                user = new { id = user.Id, userName = user.UserName, phoneNumber = user.PhoneNumber, isActive = user.IsActive },
                roles
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.PhoneNumber) || string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "جميع الحقول مطلوبة" });
            }

            var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);
            if (existingUser != null)
            {
                return Conflict(new { message = "رقم الهاتف مستخدم بالفعل" });
            }

            var user = new User { UserName = request.UserName, PhoneNumber = request.PhoneNumber, IsActive = true };
            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "حدث خطأ أثناء إنشاء المستخدم", errors = result.Errors.Select(e => e.Description) });
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                user = new { id = user.Id, userName = user.UserName, phoneNumber = user.PhoneNumber, isActive = user.IsActive },
                roles
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { success = true });
        }

        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Unauthorized(new { message = "غير مسجل الدخول" });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "غير مسجل الدخول" });
            }
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new { user = new { id = user.Id, userName = user.UserName, phoneNumber = user.PhoneNumber, isActive = user.IsActive }, roles });
        }

        [HttpPost("change-password-request")]
        public async Task<IActionResult> ChangePasswordRequest([FromBody] ChangePasswordRequestDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                return BadRequest(new { message = "رقم الهاتف مطلوب" });
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);
            if (user == null)
            {
                return NotFound(new { message = "المستخدم غير موجود" });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return Ok(new { token });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.PhoneNumber) || string.IsNullOrWhiteSpace(request.Token) || string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "جميع الحقول مطلوبة" });
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);
            if (user == null)
            {
                return NotFound(new { message = "المستخدم غير موجود" });
            }

            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "تعذر تغيير كلمة المرور", errors = result.Errors.Select(e => e.Description) });
            }

            return Ok(new { success = true });
        }
    }
}