using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asrati.Models
{
    public class Company
    {
        [Key]
        public int Id { get; set; } // Primary key

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(255, ErrorMessage = "Name cannot exceed 255 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        [StringLength(500, ErrorMessage = "Address cannot exceed 500 characters.")]
        public string Address { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        // Owner (Foreign Key to User)
        [Required]
        [ForeignKey(nameof(Owner))]
        public string OwnerId { get; set; } // FK reference to the User table (e.g., Identity User)

        public User Owner { get; set; } // Navigation property to the User
    }
}
