using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels.UserViewModel
{
    public class UserEditViewModel
    {
        public string UserId { get; set; }

        [Required]
        [StringLength(256, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 256 characters.")]
        public string UserName { get; set; }

        [Required]
        [Phone]
        public string PhoneNumber { get; set; }

        public bool IsActive { get; set; }

        // Custom validation for checking if the user can edit this field (if they are not an admin)
        public bool CanEditUserDetails { get; set; }
    }
}
