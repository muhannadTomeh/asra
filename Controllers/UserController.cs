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

        public UserController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Helper function to check if user is authorized to access or edit
       private async Task<bool> IsUserAuthorized(User user)
        {
            var loggedInUserId = _userManager.GetUserId(User);  // Get the logged-in user's ID

            // If the user is the same or the logged-in user is an admin, return true
            if (user.Id == loggedInUserId)
                return true;

            // Check if the logged-in user is an admin (no need to find user twice)
            return await _userManager.IsInRoleAsync(await _userManager.GetUserAsync(User), "Admin");
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
            var loggedInUserId = _userManager.GetUserId(User);
            id ??= loggedInUserId; // Use current user's ID if none is provided

            var user = await GetUserDetailsAsync(id);
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
            var loggedInUserId = _userManager.GetUserId(User);
            id ??= loggedInUserId;  // Use the current user's ID if none is provided

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return View("NotFound");
            }

            // Only allow the logged-in user or admin to edit the details
            if (!await IsUserAuthorized(user))
            {
                return Forbid();
            }

            // Get the logged-in user object to check for admin role
            var loggedInUser = await _userManager.GetUserAsync(User);

            // Populate the ViewModel with current user data and set permissions
            var userEditViewModel = new UserEditViewModel
            {
                UserId = user.Id,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                CanEditUserDetails = user.Id == loggedInUserId || await _userManager.IsInRoleAsync(loggedInUser, "Admin")
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

            // Only allow the logged-in user or admin to edit the details
            var loggedInUserId = _userManager.GetUserId(User);
            if (!await IsUserAuthorized(user))
            {
                return Forbid();
            }

            // Update user information
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

        // Helper method to retrieve user details
        private async Task<User> GetUserDetailsAsync(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        // Action to handle deleting a user (Admin only)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id = null)
        {
            var loggedInUserId = _userManager.GetUserId(User);
            id ??= loggedInUserId;

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
