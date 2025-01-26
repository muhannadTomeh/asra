using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels.SeasonViewModel
{
    public class SeasonEditViewModel
    {
        [Required]
        public int SeasonID { get; set; }

        [Required]
        public int CompanyID { get; set; }

        [Required]
        [Range(0, 100, ErrorMessage = "RID Percentage must be between 0 and 100.")]
        public decimal RidPercentage { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Cost of plastic tank must be a positive value.")]
        public decimal PlasticTankCost { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Weight of plastic tank must be a positive value.")]
        public decimal PlasticTankWeight { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Cost of steel tank must be a positive value.")]
        public decimal SteelTankCost { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Weight of steel tank must be a positive value.")]
        public decimal SteelTankWeight { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Service cost per kg must be a positive value.")]
        public decimal ServiceCostPerKg { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Oil selling cost must be a positive value.")]
        public decimal OilSellingCost { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Oil buying cost must be a positive value.")]
        public decimal OilBuyingCost { get; set; }

        public bool IsActiveSeason { get; set; }
        public bool CanEditSeasonDetails { get; set; }
    }
}
