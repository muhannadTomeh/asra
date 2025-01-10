using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels.AccountViewModel
{
    public class ChangePasswordRequestViewModel
    {
        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public string PhoneNumber { get; set; }
    }
}