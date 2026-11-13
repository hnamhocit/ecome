using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecome.Api.Migrations
{
    /// <inheritdoc />
    public partial class Remove_User_Online : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOnline",
                table: "Users");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceSessions_UserId",
                table: "DeviceSessions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DeviceSessions_Users_UserId",
                table: "DeviceSessions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeviceSessions_Users_UserId",
                table: "DeviceSessions");

            migrationBuilder.DropIndex(
                name: "IX_DeviceSessions_UserId",
                table: "DeviceSessions");

            migrationBuilder.AddColumn<bool>(
                name: "IsOnline",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
