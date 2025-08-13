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
    [Route("api/companies")]
    [Authorize]
    public class CompaniesApiController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<User> _userManager;

        public CompaniesApiController(ApplicationDbContext dbContext, UserManager<User> userManager)
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

        private async Task<bool> IsUserAuthorizedAsync(Company company)
        {
            var loggedInUser = await GetLoggedInUserAsync();
            return company.OwnerId == loggedInUser.Id || await IsLoggedInUserAdminAsync();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var companies = await _dbContext.Companies.Include(c => c.Owner).ToListAsync();
            var data = companies.Select(c => new
            {
                id = c.Id,
                name = c.Name,
                address = c.Address,
                ownerId = c.OwnerId,
                ownerName = c.Owner?.UserName,
                isActive = c.IsActive,
                createdAt = c.CreatedAt,
                updatedAt = c.UpdatedAt
            });
            return Ok(data);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var company = await _dbContext.Companies.Include(c => c.Owner).FirstOrDefaultAsync(c => c.Id == id);
            if (company == null) return NotFound();
            if (!await IsUserAuthorizedAsync(company)) return Forbid();
            return Ok(new
            {
                id = company.Id,
                name = company.Name,
                address = company.Address,
                ownerId = company.OwnerId,
                ownerName = company.Owner?.UserName,
                isActive = company.IsActive,
                createdAt = company.CreatedAt,
                updatedAt = company.UpdatedAt
            });
        }

        public class CreateCompanyDto
        {
            public string Name { get; set; }
            public string Address { get; set; }
            public string OwnerPhoneNumber { get; set; }
            public bool IsActive { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCompanyDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto?.Name) || string.IsNullOrWhiteSpace(dto.Address) || string.IsNullOrWhiteSpace(dto.OwnerPhoneNumber))
            {
                return BadRequest(new { message = "جميع الحقول مطلوبة" });
            }

            var owner = await _dbContext.Users.FirstOrDefaultAsync(u => u.PhoneNumber == dto.OwnerPhoneNumber);
            if (owner == null)
            {
                return BadRequest(new { message = "لا يوجد مستخدم بهذا الرقم" });
            }

            var company = new Company
            {
                Name = dto.Name,
                Address = dto.Address,
                CreatedAt = DateTime.UtcNow,
                IsActive = dto.IsActive,
                OwnerId = owner.Id
            };

            _dbContext.Companies.Add(company);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = company.Id }, new { id = company.Id });
        }

        public class UpdateCompanyDto
        {
            public string Name { get; set; }
            public string Address { get; set; }
            public bool IsActive { get; set; }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCompanyDto dto)
        {
            var company = await _dbContext.Companies.FindAsync(id);
            if (company == null) return NotFound();
            if (!await IsUserAuthorizedAsync(company)) return Forbid();

            if (string.IsNullOrWhiteSpace(dto?.Name) || string.IsNullOrWhiteSpace(dto.Address))
            {
                return BadRequest(new { message = "جميع الحقول مطلوبة" });
            }

            company.Name = dto.Name;
            company.Address = dto.Address;
            company.IsActive = dto.IsActive;
            company.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var company = await _dbContext.Companies.FindAsync(id);
            if (company == null) return NotFound();
            if (!await IsUserAuthorizedAsync(company)) return Forbid();

            _dbContext.Companies.Remove(company);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}