using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Asrati.Migrations
{
    /// <inheritdoc />
    public partial class AddSeasonModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Seasons",
                columns: table => new
                {
                    SeasonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CompanyID = table.Column<int>(type: "int", nullable: false),
                    RidPercentage = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    PlasticTankCost = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    PlasticTankWeight = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    SteelTankCost = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    SteelTankWeight = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ServiceCostPerKg = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    OilSellingCost = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    OilBuyingCost = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    IsActiveSeason = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seasons", x => x.SeasonID);
                    table.ForeignKey(
                        name: "FK_Seasons_Companies_CompanyID",
                        column: x => x.CompanyID,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_CompanyID",
                table: "Seasons",
                column: "CompanyID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Seasons");
        }
    }
}
