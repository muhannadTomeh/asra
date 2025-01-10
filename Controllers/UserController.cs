using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Asrati.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Asrati.ViewModels.UserViewModel;

namespace Asrati.Controllers
{
    public class UserController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public UserController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Action to list all users
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
            id ??= _userManager.GetUserId(User); // Use current user's ID if none is provided

            var user = await GetUserDetailsAsync(id);
            if (user == null)
            {
                return View("NotFound");
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

        // Helper method to retrieve user details
        private async Task<User> GetUserDetailsAsync(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        // Action to handle deleting a user
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return View("NotFound");
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
