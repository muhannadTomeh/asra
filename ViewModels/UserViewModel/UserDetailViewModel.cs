using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels.UserViewModel 
{
    public class UserDetailsViewModel
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsActive { get; set; }
    }
}