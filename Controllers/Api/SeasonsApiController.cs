using System;
using System.Linq;
using System.Threading.Tasks;
using Asrati.Data;
using Asrati.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Asrati.Controllers.Api
{
    [ApiController]
    [Route("api")] // we'll define nested routes below
    [Authorize]
    public class SeasonsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<User> _userManager;

        public SeasonsApiController(ApplicationDbContext dbContext, UserManager<User> userManager)
        {
            _dbContext = dbContext;
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

        private async Task<bool> HasPermissionForCompany(int companyId)
        {
            var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Id == companyId);
            if (company == null)
            {
                return false;
            }
            var user = await GetLoggedInUserAsync();
            return await IsLoggedInUserAdminAsync() || company.OwnerId == user.Id;
        }

        [HttpGet("companies/{companyId:int}/seasons")]
        public async Task<IActionResult> ListSeasons([FromRoute] int companyId)
        {
            if (!await HasPermissionForCompany(companyId)) return Forbid();

            var seasons = await _dbContext.Seasons.Where(s => s.CompanyID == companyId).ToListAsync();
            var data = seasons.Select(s => new
            {
                seasonId = s.SeasonID,
                companyId = s.CompanyID,
                ridPercentage = s.RidPercentage,
                plasticTankCost = s.PlasticTankCost,
                plasticTankWeight = s.PlasticTankWeight,
                steelTankCost = s.SteelTankCost,
                steelTankWeight = s.SteelTankWeight,
                serviceCostPerKg = s.ServiceCostPerKg,
                oilSellingCost = s.OilSellingCost,
                oilBuyingCost = s.OilBuyingCost,
                isActiveSeason = s.IsActiveSeason,
                createdAt = s.CreatedAt,
                updatedAt = s.ModifiedAt
            });
            return Ok(data);
        }

        [HttpGet("seasons/{seasonId:int}")]
        public async Task<IActionResult> SeasonDetails([FromRoute] int seasonId)
        {
            var season = await _dbContext.Seasons.FirstOrDefaultAsync(s => s.SeasonID == seasonId);
            if (season == null) return NotFound();
            if (!await HasPermissionForCompany(season.CompanyID)) return Forbid();

            return Ok(new
            {
                seasonId = season.SeasonID,
                companyId = season.CompanyID,
                ridPercentage = season.RidPercentage,
                plasticTankCost = season.PlasticTankCost,
                plasticTankWeight = season.PlasticTankWeight,
                steelTankCost = season.SteelTankCost,
                steelTankWeight = season.SteelTankWeight,
                serviceCostPerKg = season.ServiceCostPerKg,
                oilSellingCost = season.OilSellingCost,
                oilBuyingCost = season.OilBuyingCost,
                isActiveSeason = season.IsActiveSeason,
                createdAt = season.CreatedAt,
                updatedAt = season.ModifiedAt
            });
        }

        public class CreateSeasonDto
        {
            public int CompanyId { get; set; }
            public decimal RidPercentage { get; set; }
            public decimal PlasticTankCost { get; set; }
            public decimal PlasticTankWeight { get; set; }
            public decimal SteelTankCost { get; set; }
            public decimal SteelTankWeight { get; set; }
            public decimal ServiceCostPerKg { get; set; }
            public decimal OilSellingCost { get; set; }
            public decimal OilBuyingCost { get; set; }
            public bool IsActiveSeason { get; set; }
        }

        [HttpPost("companies/{companyId:int}/seasons")]
        public async Task<IActionResult> Create([FromRoute] int companyId, [FromBody] CreateSeasonDto dto)
        {
            if (!await HasPermissionForCompany(companyId)) return Forbid();
            if (dto == null || dto.CompanyId != companyId)
            {
                return BadRequest(new { message = "بيانات غير صالحة" });
            }

            var season = new Season
            {
                CompanyID = companyId,
                RidPercentage = dto.RidPercentage,
                PlasticTankCost = dto.PlasticTankCost,
                PlasticTankWeight = dto.PlasticTankWeight,
                SteelTankCost = dto.SteelTankCost,
                SteelTankWeight = dto.SteelTankWeight,
                ServiceCostPerKg = dto.ServiceCostPerKg,
                OilSellingCost = dto.OilSellingCost,
                OilBuyingCost = dto.OilBuyingCost,
                IsActiveSeason = dto.IsActiveSeason,
                CreatedAt = DateTime.UtcNow,
                ModifiedAt = DateTime.UtcNow
            };

            _dbContext.Seasons.Add(season);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(SeasonDetails), new { seasonId = season.SeasonID }, new { seasonId = season.SeasonID });
        }

        public class UpdateSeasonDto
        {
            public decimal RidPercentage { get; set; }
            public decimal PlasticTankCost { get; set; }
            public decimal PlasticTankWeight { get; set; }
            public decimal SteelTankCost { get; set; }
            public decimal SteelTankWeight { get; set; }
            public decimal ServiceCostPerKg { get; set; }
            public decimal OilSellingCost { get; set; }
            public decimal OilBuyingCost { get; set; }
            public bool IsActiveSeason { get; set; }
        }

        [HttpPut("seasons/{seasonId:int}")]
        public async Task<IActionResult> Update([FromRoute] int seasonId, [FromBody] UpdateSeasonDto dto)
        {
            var season = await _dbContext.Seasons.FindAsync(seasonId);
            if (season == null) return NotFound();
            if (!await HasPermissionForCompany(season.CompanyID)) return Forbid();

            season.RidPercentage = dto.RidPercentage;
            season.PlasticTankCost = dto.PlasticTankCost;
            season.PlasticTankWeight = dto.PlasticTankWeight;
            season.SteelTankCost = dto.SteelTankCost;
            season.SteelTankWeight = dto.SteelTankWeight;
            season.ServiceCostPerKg = dto.ServiceCostPerKg;
            season.OilSellingCost = dto.OilSellingCost;
            season.OilBuyingCost = dto.OilBuyingCost;
            season.IsActiveSeason = dto.IsActiveSeason;
            season.ModifiedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("seasons/{seasonId:int}")]
        public async Task<IActionResult> Delete([FromRoute] int seasonId)
        {
            var season = await _dbContext.Seasons.FindAsync(seasonId);
            if (season == null) return NotFound();
            if (!await HasPermissionForCompany(season.CompanyID)) return Forbid();

            _dbContext.Seasons.Remove(season);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}