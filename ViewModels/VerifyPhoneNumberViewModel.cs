using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels
{
    public class VerifyPhoneNumberViewModel
    {
        [Required(ErrorMessage = "Phone number is required.")]
        [Phone(ErrorMessage = "Invalid phone number.")]
        public string PhoneNumber { get; set; }
    }
}
