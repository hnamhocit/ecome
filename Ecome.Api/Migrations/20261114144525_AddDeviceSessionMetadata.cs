using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecome.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDeviceSessionMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DeviceName",
                table: "DeviceSessions",
                newName: "UserAgent");

            migrationBuilder.AlterColumn<string>(
                name: "UserAgent",
                table: "DeviceSessions",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(512)",
                oldMaxLength: 512);

            migrationBuilder.RenameColumn(
                name: "LastSeenAt",
                table: "DeviceSessions",
                newName: "LastUsedAt");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastUsedAt",
                table: "DeviceSessions",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.RenameColumn(
                name: "Ip",
                table: "DeviceSessions",
                newName: "IpAddress");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiresAt",
                table: "DeviceSessions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW() + INTERVAL '30 days'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpiresAt",
                table: "DeviceSessions");

            migrationBuilder.RenameColumn(
                name: "IpAddress",
                table: "DeviceSessions",
                newName: "Ip");

            migrationBuilder.RenameColumn(
                name: "LastUsedAt",
                table: "DeviceSessions",
                newName: "LastSeenAt");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastSeenAt",
                table: "DeviceSessions",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.RenameColumn(
                name: "UserAgent",
                table: "DeviceSessions",
                newName: "DeviceName");

            migrationBuilder.AlterColumn<string>(
                name: "DeviceName",
                table: "DeviceSessions",
                type: "character varying(512)",
                maxLength: 512,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(1024)",
                oldMaxLength: 1024,
                oldNullable: true);
        }
    }
}
