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

        // Action to show user details
        [HttpGet]
        public async Task<IActionResult> UserDetails(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
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

        // Action to show the Create User form
        // public IActionResult Create()
        // {
        //     return View();
        // }

        // // Action to handle creating a new user
        // [HttpPost]
        // [ValidateAntiForgeryToken]
        // public async Task<IActionResult> Create(CreateUserViewModel model)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         var user = new User
        //         {
        //             UserName = model.UserName,
        //             PhoneNumber = model.PhoneNumber
        //         };

        //         var result = await _userManager.CreateAsync(user, model.Password);

        //         if (result.Succeeded)
        //         {
        //             return RedirectToAction(nameof(ListUsers));
        //         }

        //         foreach (var error in result.Errors)
        //         {
        //             ModelState.AddModelError(string.Empty, error.Description);
        //         }
        //     }

        //     return View(model);
        // }

        // Action to show the Edit User form
        // public async Task<IActionResult> Edit(string id)
        // {
        //     var user = await _userManager.FindByIdAsync(id);

        //     if (user == null)
        //     {
        //         return NotFound();
        //     }

        //     var model = new EditUserViewModel
        //     {
        //         UserId = user.Id,
        //         UserName = user.UserName,
        //         PhoneNumber = user.PhoneNumber
        //     };

        //     return View(model);
        // }

        // // Action to handle editing a user
        // [HttpPost]
        // [ValidateAntiForgeryToken]
        // public async Task<IActionResult> Edit(EditUserViewModel model)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         var user = await _userManager.FindByIdAsync(model.UserId);

        //         if (user == null)
        //         {
        //             return NotFound();
        //         }

        //         user.UserName = model.UserName;
        //         user.PhoneNumber = model.PhoneNumber;

        //         var result = await _userManager.UpdateAsync(user);

        //         if (result.Succeeded)
        //         {
        //             return RedirectToAction(nameof(ListUsers));
        //         }

        //         foreach (var error in result.Errors)
        //         {
        //             ModelState.AddModelError(string.Empty, error.Description);
        //         }
        //     }

        //     return View(model);
        // }

        // Action to show the Delete User confirmation
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }

        // Action to handle deleting a user
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound();
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
