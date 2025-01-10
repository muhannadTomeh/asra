using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels.UserViewModel
{
    public class UserListViewModel
    {
        [Required]
        public string UserId { get; set; }
        
        [Required]
        [Phone]
        public string PhoneNumber { get; set; }
        
        [Required]
        public string UserName { get; set; }
    }
}
