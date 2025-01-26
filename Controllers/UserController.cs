using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Asrati.Models;
using Asrati.ViewModels.UserViewModel;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Asrati.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private User _loggedInUser; // Cache the logged-in user for this request

        public UserController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Helper to get the logged-in user (cached)
        private async Task<User> GetLoggedInUserAsync()
        {
            if (_loggedInUser == null)
            {
                _loggedInUser = await _userManager.GetUserAsync(User);
            }
            return _loggedInUser;
        }

        // Helper to check if the logged-in user is an Admin
        private async Task<bool> IsLoggedInUserAdminAsync()
        {
            var user = await GetLoggedInUserAsync();
            return await _userManager.IsInRoleAsync(user, "Admin");
        }

        // Helper to check if the logged-in user is authorized to act on another user
        private async Task<bool> IsUserAuthorized(User user)
        {
            var loggedInUser = await GetLoggedInUserAsync();

            // Allow access if the logged-in user is the same or if they are an Admin
            return user.Id == loggedInUser.Id || await IsLoggedInUserAdminAsync();
        }

        // Action to list all users (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> ListUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var userViewModels = users.Select(user => new UserListViewModel
            {
                UserId = user.Id,
                PhoneNumber = user.PhoneNumber,
                UserName = user.UserName,
                IsActive = user.IsActive
            }).ToList();

            return View(userViewModels);
        }

        // Action to show user details or current user's details
        [HttpGet]
        public async Task<IActionResult> UserDetails(string id = null)
        {
            var loggedInUser = await GetLoggedInUserAsync();
            id ??= loggedInUser.Id; // Default to logged-in user's ID if no ID is provided

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return View("NotFound");
            }

            if (!await IsUserAuthorized(user))
            {
                return Forbid();
            }

            var userDetailViewModel = new UserDetailsViewModel
            {
                UserId = user.Id,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive
            };

            return View(userDetailViewModel);
        }

        // Action to handle editing user details (Admin or logged-in user)
        [HttpGet]
        public async Task<IActionResult> EditUser(string id = null)
        {
            var loggedInUser = await GetLoggedInUserAsync();
            id ??= loggedInUser.Id; // Default to logged-in user's ID if no ID is provided

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return View("NotFound");
            }

            if (!await IsUserAuthorized(user))
            {
                return Forbid();
            }

            var userEditViewModel = new UserEditViewModel
            {
                UserId = user.Id,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                CanEditUserDetails = user.Id == loggedInUser.Id || await IsLoggedInUserAdminAsync()
            };

            return View(userEditViewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditUser(UserEditViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return View("NotFound");
            }

            if (!await IsUserAuthorized(user))
            {
                return Forbid();
            }

            user.UserName = model.UserName;
            user.PhoneNumber = model.PhoneNumber;
            user.IsActive = model.IsActive;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return RedirectToAction(nameof(UserDetails), new { id = user.Id });
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id = null)
        {
            var loggedInUser = await GetLoggedInUserAsync();
            id ??= loggedInUser.Id;

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return View("NotFound");
            }

            if (!await IsUserAuthorized(user))
            {
                return Forbid();
            }

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return RedirectToAction(nameof(ListUsers));
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return View(user);
        }
    }
}
