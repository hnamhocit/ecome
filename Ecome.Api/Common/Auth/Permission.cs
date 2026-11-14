namespace Ecome.Api.Common.Auth;

public static class Permissions
{
    public const string CustomersView = "customers.view";
    public const string CustomersBan = "customers.ban";

    public const string StaffManage = "staff.manage";
    public const string RolesManage = "roles.manage";

    public const string ProductsView = "products.view";
    public const string ProductsManage = "products.manage";

    public const string OrdersView = "orders.view";
    public const string OrdersManage = "orders.manage";

    public const string VouchersManage = "vouchers.manage";

    public static readonly (string Code, string Module, string Description)[] All =
    [
        (CustomersView, "Khách hàng", "Xem danh sách và chi tiết khách hàng"),
        (CustomersBan, "Khách hàng", "Khóa hoặc mở khóa tài khoản khách hàng"),

        (StaffManage, "Nhân sự & Quyền", "Bổ nhiệm nhân viên và gán vai trò"),
        (RolesManage, "Nhân sự & Quyền", "Tạo, sửa vai trò và ma trận phân quyền"),

        (ProductsView, "Sản phẩm", "Xem danh sách và tồn kho sản phẩm"),
        (ProductsManage, "Sản phẩm", "Thêm, sửa, ẩn sản phẩm"),

        (OrdersView, "Đơn hàng", "Xem danh sách và chi tiết đơn hàng"),
        (OrdersManage, "Đơn hàng", "Xác nhận, giao vận và hủy/hoàn đơn"),

        (VouchersManage, "Khuyến mãi", "Tạo và quản lý mã giảm giá")
    ];
}