using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels.AccountViewModel
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        // Optional: If you want to remember the user (e.g., for a "Remember me" checkbox)
        public bool RememberMe { get; set; }
    }
}
