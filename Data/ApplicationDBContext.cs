using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Asrati.Models;

namespace Asrati.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Add unique constraint to PhoneNumber
            builder.Entity<User>()
                .HasIndex(u => u.PhoneNumber)
                .IsUnique();

            // Other configurations
        }
    }
}
