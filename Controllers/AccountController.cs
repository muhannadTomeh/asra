using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Asrati.ViewModels;
using Asrati.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Asrati.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountController(SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // Login GET
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        // Login POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(user, model.Password, model.RememberMe, false);
                    if (result.Succeeded)
                    {
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    }
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "User not found.");
                }
            }

            return View(model);
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model) {
            if (ModelState.IsValid)
            {
                var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
                if (existingUser != null)
                {
                    ModelState.AddModelError("PhoneNumber", "The phone number is already in use.");
                    return View(model);
                }

                var user = new User { UserName = model.UserName, PhoneNumber = model.PhoneNumber, IsActive = true };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
            }

            return View(model);
        }

        // Logout GET
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

        // Change Password Request GET
        [HttpGet]
        public IActionResult ChangePasswordRequest()
        {
            return View();
        }

        // Change Password Request POST (to send the reset token)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePasswordRequest(ChangePasswordRequestViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
                if (user != null)
                {
                    // Generate the password reset token
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                    // Send the token to the user (via email or other method)
                    // You could implement an email sending service here to send the token
                    // Here we're just redirecting to a change password view with the token for simplicity
                    return RedirectToAction("ChangePassword", new { token = token });
                }
                else
                {
                    ModelState.AddModelError("PhoneNumber", "User not found.");
                }
            }

            return View(model);
        }

        // Change Password GET (with Token)
        [HttpGet]
        public IActionResult ChangePassword(string token)
        {
            if (token == null)
            {
                return BadRequest("Invalid token.");
            }

            var model = new ChangePasswordViewModel { Token = token };
            return View(model);
        }

        // Change Password POST (with Token)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
                if (user != null)
                {
                    // Reset the user's password using the token
                    var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
                    if (result.Succeeded)
                    {
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        foreach (var error in result.Errors)
                        {
                            ModelState.AddModelError(string.Empty, error.Description);
                        }
                    }
                }
                else
                {
                    ModelState.AddModelError("PhoneNumber", "User not found.");
                }
            }

            return View(model);
        }

    }
}
