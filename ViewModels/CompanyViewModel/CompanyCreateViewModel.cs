using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels.CompanyViewModel
{
    public class CompanyCreateViewModel
    {
        [Required]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Company name must be between 3 and 100 characters.")]
        public string Name { get; set; }

        [Required]
        [StringLength(256, MinimumLength = 3, ErrorMessage = "Address must be between 3 and 256 characters.")]
        public string Address { get; set; }

        [Required]
        [Phone(ErrorMessage = "Please enter a valid phone number for the owner.")]
        public string OwnerPhoneNumber { get; set; }  // Added phone number for the owner

        public bool IsActive { get; set; }
    }
}
