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
    [Route("api/users")]
    [Authorize]
    public class UsersApiController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersApiController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        private async Task<User> GetLoggedInUserAsync()
        {
            return await _userManager.GetUserAsync(User);
        }

        private async Task<bool> IsLoggedInUserAdminAsync()
        {
            var user = await GetLoggedInUserAsync();
            return await _userManager.IsInRoleAsync(user, "Admin");
        }

        private async Task<bool> IsUserAuthorized(User user)
        {
            var loggedInUser = await GetLoggedInUserAsync();
            return user.Id == loggedInUser.Id || await IsLoggedInUserAdminAsync();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ListUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var data = users.Select(u => new { userId = u.Id, userName = u.UserName, phoneNumber = u.PhoneNumber, isActive = u.IsActive });
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> UserDetails([FromRoute] string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                var currentUser = await GetLoggedInUserAsync();
                id = currentUser?.Id;
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            if (!await IsUserAuthorized(user)) return Forbid();

            return Ok(new { userId = user.Id, userName = user.UserName, phoneNumber = user.PhoneNumber, isActive = user.IsActive });
        }

        public class UpdateUserDto
        {
            public string UserName { get; set; }
            public string PhoneNumber { get; set; }
            public bool IsActive { get; set; }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser([FromRoute] string id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            if (!await IsUserAuthorized(user)) return Forbid();

            user.UserName = dto.UserName;
            user.PhoneNumber = dto.PhoneNumber;
            user.IsActive = dto.IsActive;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            if (!await IsUserAuthorized(user)) return Forbid();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
            }

            return NoContent();
        }
    }
}