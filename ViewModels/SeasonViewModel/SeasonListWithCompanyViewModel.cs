using System.ComponentModel.DataAnnotations;

namespace Asrati.ViewModels.SeasonViewModel
{
    public class SeasonListWithCompanyViewModel
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public List<SeasonListViewModel> Seasons { get; set; }
    }

}