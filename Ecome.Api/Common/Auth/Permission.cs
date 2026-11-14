namespace Ecome.Api.Common.Auth;

public static class Permissions
{
    // Customers
    public const string CustomersView = "customers.view";
    public const string CustomersBan = "customers.ban";

    // Team & Access (IAM)
    public const string StaffManage = "staff.manage";
    public const string RolesManage = "roles.manage";

    // Seller Onboarding & KYC/KYB
    public const string SellersView = "sellers.view";
    public const string SellersReview = "sellers.review";

    // Catalog & Products (Platform-wide vs Self Shop)
    public const string ProductsView = "products.view";
    public const string ProductsManage = "products.manage";
    public const string ProductsViewSelf = "products.view.self";
    public const string ProductsManageSelf = "products.manage.self";

    // Orders (Platform-wide vs Self Shop)
    public const string OrdersView = "orders.view";
    public const string OrdersManage = "orders.manage";
    public const string OrdersViewSelf = "orders.view.self";
    public const string OrdersManageSelf = "orders.manage.self";

    // Promotions & Shop Settings
    public const string VouchersManage = "vouchers.manage";
    public const string VouchersManageSelf = "vouchers.manage.self";
    public const string ShopManageSelf = "shop.manage.self";

    public static readonly (string Code, string Module, string Description)[] All =
    [
        (CustomersView, "Customers", "View customer profiles and account details"),
        (CustomersBan, "Customers", "Suspend or reactivate customer accounts"),

        (StaffManage, "Team & Access", "Assign roles and manage internal staff"),
        (RolesManage, "Team & Access", "Create roles and configure permission matrix"),

        (SellersView, "Seller Verification", "View seller applications and shop listings"),
        (SellersReview, "Seller Verification", "Approve or reject KYC/KYB applications and suspend shops"),

        (ProductsView, "Catalog", "View all platform products and inventory levels"),
        (ProductsManage, "Catalog", "Create, edit, or delist any product on the platform"),
        (ProductsViewSelf, "Catalog", "View products and inventory of own shop"),
        (ProductsManageSelf, "Catalog", "Create, update, and archive products in own shop"),

        (OrdersView, "Orders", "View all customer orders across the platform"),
        (OrdersManage, "Orders", "Process, ship, and refund any platform order"),
        (OrdersViewSelf, "Orders", "View customer orders placed in own shop"),
        (OrdersManageSelf, "Orders", "Confirm, pack, and fulfill orders for own shop"),

        (VouchersManage, "Promotions", "Create and manage platform-wide discount vouchers"),
        (VouchersManageSelf, "Promotions", "Create and manage discount vouchers for own shop"),

        (ShopManageSelf, "Shop Settings", "Update own shop profile, logo, and pickup addresses")
    ];
}