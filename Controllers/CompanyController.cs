using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Asrati.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Asrati.Data;

namespace Asrati.Controllers
{
    [Authorize]
    public class CompanyController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _dbContext;
        private User _loggedInUser; // Cache for the logged-in user

        public CompanyController(UserManager<User> userManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
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

        // Helper to check if the logged-in user is authorized for a company
        private async Task<bool> IsUserAuthorized(Company company)
        {
            var loggedInUser = await GetLoggedInUserAsync();

            // Allow access if the logged-in user is the owner or an Admin
            return company.OwnerId == loggedInUser.Id || await IsLoggedInUserAdminAsync();
        }

        // Action to list all companies (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> ListCompanies()
        {
            var companies = await _dbContext.Companies.Include(c => c.Owner).ToListAsync();

            var companyViewModels = companies.Select(company => new
            {
                company.Id,
                company.Name,
                company.Address,
                OwnerName = company.Owner.UserName,
                company.IsActive,
                company.CreatedAt
            });

            return View(companyViewModels);
        }

        // Action to show details for a company
        [HttpGet]
        public async Task<IActionResult> CompanyDetails(int id)
        {
            var company = await _dbContext.Companies.Include(c => c.Owner).FirstOrDefaultAsync(c => c.Id == id);

            if (company == null)
            {
                return View("NotFound");
            }

            if (!await IsUserAuthorized(company))
            {
                return Forbid();
            }

            return View(company);
        }

        // Action to create a new company (Admin or any user)
        [HttpGet]
        public IActionResult CreateCompany()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateCompany(Company model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var loggedInUser = await GetLoggedInUserAsync();

            var company = new Company
            {
                Name = model.Name,
                Address = model.Address,
                CreatedAt = DateTime.UtcNow,
                IsActive = model.IsActive,
                OwnerId = loggedInUser.Id // Set the logged-in user as the owner
            };

            _dbContext.Companies.Add(company);
            await _dbContext.SaveChangesAsync();

            return RedirectToAction(nameof(ListCompanies));
        }

        // Action to edit a company (Admin or owner)
        [HttpGet]
        public async Task<IActionResult> EditCompany(int id)
        {
            var company = await _dbContext.Companies.FindAsync(id);
            if (company == null)
            {
                return View("NotFound");
            }

            if (!await IsUserAuthorized(company))
            {
                return Forbid();
            }

            return View(company);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditCompany(Company model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var company = await _dbContext.Companies.FindAsync(model.Id);
            if (company == null)
            {
                return View("NotFound");
            }

            if (!await IsUserAuthorized(company))
            {
                return Forbid();
            }

            company.Name = model.Name;
            company.Address = model.Address;
            company.IsActive = model.IsActive;
            company.UpdatedAt = DateTime.UtcNow;

            _dbContext.Companies.Update(company);
            await _dbContext.SaveChangesAsync();

            return RedirectToAction(nameof(CompanyDetails), new { id = company.Id });
        }

        // Action to delete a company (Admin or owner)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            var company = await _dbContext.Companies.FindAsync(id);
            if (company == null)
            {
                return View("NotFound");
            }

            if (!await IsUserAuthorized(company))
            {
                return Forbid();
            }

            _dbContext.Companies.Remove(company);
            await _dbContext.SaveChangesAsync();

            return RedirectToAction(nameof(ListCompanies));
        }
    }
}
