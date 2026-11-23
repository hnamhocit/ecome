using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecome.Api.Migrations
{
    /// <inheritdoc />
    public partial class FinalizeMediaAndSessionSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MediaAssets_Users_OwnerId",
                table: "MediaAssets");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_MediaAssets_Bucket_ObjectKey",
                table: "MediaAssets");

            migrationBuilder.DropIndex(
                name: "IX_DeviceSessions_UserId",
                table: "DeviceSessions");

            migrationBuilder.DropColumn(
                name: "Purpose",
                table: "MediaAssets");

            migrationBuilder.Sql(
                """
                ALTER TABLE "MediaAssets" ALTER COLUMN "Status" TYPE character varying(32)
                    USING (CASE "Status" WHEN 0 THEN 'Pending' WHEN 1 THEN 'Attached' END);

                UPDATE "DeviceSessions" SET "LastUsedAt" = "CreatedAt"
                    WHERE "LastUsedAt" = '-infinity'::timestamp with time zone;
                ALTER TABLE "DeviceSessions" ALTER COLUMN "LastUsedAt" DROP DEFAULT;
                """);

            migrationBuilder.CreateIndex(
                name: "IX_MediaAssets_Bucket_ObjectKey",
                table: "MediaAssets",
                columns: new[] { "Bucket", "ObjectKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DeviceSessions_ExpiresAt",
                table: "DeviceSessions",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceSessions_UserId_LastUsedAt",
                table: "DeviceSessions",
                columns: new[] { "UserId", "LastUsedAt" },
                filter: "\"RevokedAt\" IS NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_MediaAssets_Users_OwnerId",
                table: "MediaAssets",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                table: "UserRoles",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MediaAssets_Users_OwnerId",
                table: "MediaAssets");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_MediaAssets_Bucket_ObjectKey",
                table: "MediaAssets");

            migrationBuilder.DropIndex(
                name: "IX_DeviceSessions_ExpiresAt",
                table: "DeviceSessions");

            migrationBuilder.DropIndex(
                name: "IX_DeviceSessions_UserId_LastUsedAt",
                table: "DeviceSessions");

            migrationBuilder.Sql(
                """
                ALTER TABLE "MediaAssets" ALTER COLUMN "Status" TYPE integer
                    USING (CASE "Status" WHEN 'Pending' THEN 0 WHEN 'Attached' THEN 1 END);
                ALTER TABLE "DeviceSessions" ALTER COLUMN "LastUsedAt"
                    SET DEFAULT '-infinity'::timestamp with time zone;
                """);

            migrationBuilder.AddColumn<int>(
                name: "Purpose",
                table: "MediaAssets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(
                """ALTER TABLE "MediaAssets" ALTER COLUMN "Purpose" DROP DEFAULT;""");

            migrationBuilder.CreateIndex(
                name: "IX_MediaAssets_Bucket_ObjectKey",
                table: "MediaAssets",
                columns: new[] { "Bucket", "ObjectKey" });

            migrationBuilder.CreateIndex(
                name: "IX_DeviceSessions_UserId",
                table: "DeviceSessions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MediaAssets_Users_OwnerId",
                table: "MediaAssets",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Roles_RoleId",
                table: "UserRoles",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
