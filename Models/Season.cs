using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asrati.Models
{
    public class Season
    {
        [Key]
        public int SeasonID { get; set; } // Primary key

        [Required]
        [ForeignKey(nameof(Company))]
        public int CompanyID { get; set; } // FK reference to the Company table

        // Rid percentage from total
        [Required]
        [Range(0, 100, ErrorMessage = "Rid percentage must be between 0 and 100.")]
        public decimal RidPercentage { get; set; }

        // Cost of plastic tank
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Cost of plastic tank must be a positive number.")]
        public decimal PlasticTankCost { get; set; }

        // Weight of plastic tank
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Weight of plastic tank must be a positive number.")]
        public decimal PlasticTankWeight { get; set; }

        // Cost of steel tank
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Cost of steel tank must be a positive number.")]
        public decimal SteelTankCost { get; set; }

        // Weight of steel tank
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Weight of steel tank must be a positive number.")]
        public decimal SteelTankWeight { get; set; }

        // Cost of doing the service per 1Kg
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Cost of service per Kg must be a positive number.")]
        public decimal ServiceCostPerKg { get; set; }

        // Cost of selling the oil
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Oil selling cost must be a positive number.")]
        public decimal OilSellingCost { get; set; }

        // Cost of buying the oil
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Oil buying cost must be a positive number.")]
        public decimal OilBuyingCost { get; set; }

        // Indicates if the season is active
        [Required]
        public bool IsActiveSeason { get; set; } = true;

        // Timestamp for when the season was created
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Timestamp for the last modification
        public DateTime? ModifiedAt { get; set; }

        // Navigation property for the Company
        public Company Company { get; set; }
    }
}
