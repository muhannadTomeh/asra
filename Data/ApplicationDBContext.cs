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

        // DbSet for Company
        public DbSet<Company> Companies { get; set; }

        // DbSet for Season
        public DbSet<Season> Seasons { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Add unique constraint to PhoneNumber for the User Model
            builder.Entity<User>()
                .HasIndex(u => u.PhoneNumber)
                .IsUnique();

            // Add unique constraint to OwnerId for the Company Model
            builder.Entity<Company>()
                .HasIndex(c => c.OwnerId)
                .IsUnique();

            // Configure relationships with cascade delete and update for Company
            builder.Entity<Company>()
                .HasOne(c => c.Owner)
                .WithMany()
                .HasForeignKey(c => c.OwnerId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete when the owner is deleted

            // Optional: Set cascade update by ensuring the foreign key updates automatically
            builder.Entity<Company>()
                .Navigation(c => c.Owner)
                .IsRequired(); // Ensures the owner is always set

            // Configure relationships for the Season model
            builder.Entity<Season>()
                .HasOne(s => s.Company) // A season belongs to a company
                .WithMany() // A company can have many seasons
                .HasForeignKey(s => s.CompanyID)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete when the company is deleted
        }
    }
}
