using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Asrati.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Asrati.Data;
using Asrati.ViewModels.SeasonViewModel;
using System;

namespace Asrati.Controllers
{
    [Authorize]
    public class SeasonController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _dbContext;
        private User _loggedInUser; // Cache for the logged-in user

        public SeasonController(UserManager<User> userManager, ApplicationDbContext dbContext)
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

        // Helper method to check if the user has permission for a specific company
        private async Task<bool> HasPermissionForCompany(int companyId)
        {
            var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == companyId);
            if (company == null)
            {
                return false; // Company not found
            }

            var user = await GetLoggedInUserAsync();
            return await IsLoggedInUserAdminAsync() || company.OwnerId == user.Id;
        }

        // Action to list all seasons for a specific company (Admin or Company Owner)
        [HttpGet]
        public async Task<IActionResult> ListSeasons(int companyId)
        {
            if (!await HasPermissionForCompany(companyId))
            {
                return Forbid();
            }

            var seasons = await _dbContext.Seasons
                .Where(s => s.CompanyID == companyId)
                .Include(s => s.Company)
                .ToListAsync();

            var seasonViewModels = seasons.Select(season => new SeasonListViewModel
            {
                SeasonID = season.SeasonID,
                CompanyID = season.CompanyID,
                CompanyName = season.Company.Name,
                RidPercentage = season.RidPercentage,
                PlasticTankCost = season.PlasticTankCost,
                PlasticTankWeight = season.PlasticTankWeight,
                SteelTankCost = season.SteelTankCost,
                SteelTankWeight = season.SteelTankWeight,
                ServiceCostPerKg = season.ServiceCostPerKg,
                OilSellingCost = season.OilSellingCost,
                OilBuyingCost = season.OilBuyingCost,
                IsActiveSeason = season.IsActiveSeason,
                CreatedAt = season.CreatedAt
            }).ToList();

            var model = new SeasonListWithCompanyViewModel
            {
                CompanyId = companyId,
                CompanyName = (await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == companyId))?.Name,
                Seasons = seasonViewModels
            };

            return View(model);
        }

        // Action to show details for a specific season
        [HttpGet]
        public async Task<IActionResult> SeasonDetails(int seasonId)
        {
            var season = await _dbContext.Seasons.Include(s => s.Company).FirstOrDefaultAsync(s => s.SeasonID == seasonId);

            if (season == null || !await HasPermissionForCompany(season.CompanyID))
            {
                return Forbid(); // Forbid if no permission
            }

            var seasonDetailsViewModel = new SeasonDetailsViewModel
            {
                SeasonID = season.SeasonID,
                CompanyID = season.CompanyID,
                RidPercentage = season.RidPercentage,
                PlasticTankCost = season.PlasticTankCost,
                PlasticTankWeight = season.PlasticTankWeight,
                SteelTankCost = season.SteelTankCost,
                SteelTankWeight = season.SteelTankWeight,
                ServiceCostPerKg = season.ServiceCostPerKg,
                OilSellingCost = season.OilSellingCost,
                OilBuyingCost = season.OilBuyingCost,
                IsActiveSeason = season.IsActiveSeason,
                CreatedAt = season.CreatedAt,
                UpdatedAt = season.ModifiedAt
            };

            return View(seasonDetailsViewModel);
        }

        // Action to create a new season (Admin or Company Owner)
        [HttpGet]
        public async Task<IActionResult> CreateSeason(int companyId)
        {
            if (!await HasPermissionForCompany(companyId))
            {
                return Forbid(); // Forbid if no permission
            }

            var viewModel = new SeasonCreateViewModel
            {
                CompanyID = companyId // Set the CompanyID here
            };

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateSeason(SeasonCreateViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (!await HasPermissionForCompany(model.CompanyID))
            {
                return Forbid(); // Forbid if no permission
            }

            var season = new Season
            {
                CompanyID = model.CompanyID,
                RidPercentage = model.RidPercentage,
                PlasticTankCost = model.PlasticTankCost,
                PlasticTankWeight = model.PlasticTankWeight,
                SteelTankCost = model.SteelTankCost,
                SteelTankWeight = model.SteelTankWeight,
                ServiceCostPerKg = model.ServiceCostPerKg,
                OilSellingCost = model.OilSellingCost,
                OilBuyingCost = model.OilBuyingCost,
                IsActiveSeason = model.IsActiveSeason,
                CreatedAt = DateTime.UtcNow,
                ModifiedAt = DateTime.UtcNow,
            };

            _dbContext.Seasons.Add(season);
            await _dbContext.SaveChangesAsync();

            return RedirectToAction(nameof(ListSeasons), new { companyId = model.CompanyID });
        }

        // Action to edit a season (Admin or company owner)
        [HttpGet]
        public async Task<IActionResult> EditSeason(int seasonId)
        {
            var season = await _dbContext.Seasons
                .Include(s => s.Company) // Include company details for the season
                .FirstOrDefaultAsync(s => s.SeasonID == seasonId);

            if (season == null || !await HasPermissionForCompany(season.CompanyID))
            {
                return Forbid(); // Forbid if no permission
            }

            var model = new SeasonEditViewModel
            {
                SeasonID = season.SeasonID,
                CompanyID = season.CompanyID,
                RidPercentage = season.RidPercentage,
                PlasticTankCost = season.PlasticTankCost,
                PlasticTankWeight = season.PlasticTankWeight,
                SteelTankCost = season.SteelTankCost,
                SteelTankWeight = season.SteelTankWeight,
                ServiceCostPerKg = season.ServiceCostPerKg,
                OilSellingCost = season.OilSellingCost,
                OilBuyingCost = season.OilBuyingCost,
                IsActiveSeason = season.IsActiveSeason,
                CanEditSeasonDetails = await IsLoggedInUserAdminAsync() || season.Company.OwnerId == (await GetLoggedInUserAsync()).Id
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditSeason(SeasonEditViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var season = await _dbContext.Seasons.FindAsync(model.SeasonID);
            if (season == null || !await HasPermissionForCompany(season.CompanyID))
            {
                return Forbid(); // Forbid if no permission
            }

            season.RidPercentage = model.RidPercentage;
            season.PlasticTankCost = model.PlasticTankCost;
            season.PlasticTankWeight = model.PlasticTankWeight;
            season.SteelTankCost = model.SteelTankCost;
            season.SteelTankWeight = model.SteelTankWeight;
            season.ServiceCostPerKg = model.ServiceCostPerKg;
            season.OilSellingCost = model.OilSellingCost;
            season.OilBuyingCost = model.OilBuyingCost;
            season.IsActiveSeason = model.IsActiveSeason;
            season.ModifiedAt = DateTime.UtcNow;

            _dbContext.Seasons.Update(season);
            await _dbContext.SaveChangesAsync();

            return RedirectToAction(nameof(SeasonDetails), new { seasonId = season.SeasonID });
        }

        // Action to delete a season (Admin or owner)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteSeason(int seasonId)
        {
            var season = await _dbContext.Seasons.FindAsync(seasonId);
            if (season == null || !await HasPermissionForCompany(season.CompanyID))
            {
                return Forbid(); // Forbid if no permission
            }

            _dbContext.Seasons.Remove(season);
            await _dbContext.SaveChangesAsync();

            return RedirectToAction(nameof(ListSeasons), new { companyId = season.CompanyID });
        }
    }

}
