using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels.CompanyViewModel
{
    public class CompanyEditViewModel
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Company name must be between 3 and 100 characters.")]
        public string Name { get; set; }

        [Required]
        [StringLength(256, MinimumLength = 3, ErrorMessage = "Address must be between 3 and 256 characters.")]
        public string Address { get; set; }

        public bool IsActive { get; set; }

        // Custom validation or conditions (if any, e.g. for checking ownership)
        public bool CanEditCompanyDetails { get; set; }
    }
}
