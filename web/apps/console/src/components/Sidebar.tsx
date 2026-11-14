import { NavLink } from "react-router"
import { useUserStore } from "@workspace/stores"
import { usePermission } from "@workspace/auth"
import {
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconPackage,
  IconBoxMultipleFilled,
  IconShoppingCart,
  IconShoppingCartFilled,
  IconUsers,
  IconUserFilled,
  IconShieldLock,
  IconShieldLockFilled,
  IconSettings,
  IconSettingsFilled,
  IconCircleFilled,
} from "@tabler/icons-react"

interface NavItem {
  to: string
  label: string
  iconOutline: React.ComponentType<{ className?: string }>
  iconFilled: React.ComponentType<{ className?: string }>
  permission?: string
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    iconOutline: IconLayoutDashboard,
    iconFilled: IconLayoutDashboardFilled,
  },
  {
    to: "/products",
    label: "Products",
    iconOutline: IconPackage,
    iconFilled: IconBoxMultipleFilled,
    permission: "products.view",
  },
  {
    to: "/orders",
    label: "Orders",
    iconOutline: IconShoppingCart,
    iconFilled: IconShoppingCartFilled,
    permission: "orders.view",
  },
  {
    to: "/customers",
    label: "Customers & Staff",
    iconOutline: IconUsers,
    iconFilled: IconUserFilled,
    permission: "customers.view",
  },
  {
    to: "/iam",
    label: "IAM & Permissions",
    iconOutline: IconShieldLock,
    iconFilled: IconShieldLockFilled,
    permission: "roles.manage",
  },
  {
    to: "/settings",
    label: "Settings",
    iconOutline: IconSettings,
    iconFilled: IconSettingsFilled,
  },
]

export function Sidebar() {
  const { user } = useUserStore()
  const canViewProducts = usePermission("products.view")
  const canViewOrders = usePermission("orders.view")
  const canViewCustomers = usePermission("customers.view") || usePermission("staff.manage")
  const canManageRoles = usePermission("roles.manage")

  const isItemVisible = (item: NavItem) => {
    if (!item.permission) return true
    if (user?.roles?.includes("SuperAdmin")) return true
    if (item.permission === "products.view") return canViewProducts
    if (item.permission === "orders.view") return canViewOrders
    if (item.permission === "customers.view") return canViewCustomers
    if (item.permission === "roles.manage") return canManageRoles
    return true
  }

  const visibleNavItems = NAV_ITEMS.filter(isItemVisible)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950">
      {/* Brand Header */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 font-heading text-lg font-black text-white shadow-lg shadow-emerald-600/20">
          E
        </div>
        <div>
          <span className="font-heading text-lg font-black tracking-tight text-slate-900 dark:text-white">
            ECOME
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <IconCircleFilled className="size-2 animate-pulse text-emerald-500" />
            <span>SELLER CONSOLE</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        <div className="mb-2 px-2 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
          Management
        </div>
        {visibleNavItems.map((item) => {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => {
                const IconComponent = isActive ? item.iconFilled : item.iconOutline
                return (
                  <div className="flex items-center gap-3">
                    <IconComponent className="size-5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                )
              }}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
