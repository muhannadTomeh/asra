using System;

namespace Asrati.ViewModels.SeasonViewModel
{
    public class SeasonListViewModel
    {
        public int SeasonID { get; set; }
        public int CompanyID { get; set; }
        public string CompanyName { get; set; }
        public decimal RidPercentage { get; set; }
        public decimal PlasticTankCost { get; set; }
        public decimal PlasticTankWeight { get; set; }
        public decimal SteelTankCost { get; set; }
        public decimal SteelTankWeight { get; set; }
        public decimal ServiceCostPerKg { get; set; }
        public decimal OilSellingCost { get; set; }
        public decimal OilBuyingCost { get; set; }
        public bool IsActiveSeason { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
