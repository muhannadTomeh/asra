using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Identity;

namespace Asrati.Models
{
    public class User: IdentityUser
    {
        [Required]
        public bool IsActive { get; set; } = true;
    }
}
