import { Routes, Route, Navigate } from "react-router"
import { ConsoleGuard } from "./components/ConsoleGuard"
import { ConsoleLayout } from "./components/ConsoleLayout"
import { DashboardView } from "./views/DashboardView"
import { ProductsView } from "./views/ProductsView"
import { OrdersView } from "./views/OrdersView"
import { CustomersView } from "./views/CustomersView"
import { IamView } from "./views/IamView"
import { SettingsView } from "./views/SettingsView"

export default function App() {
  return (
    <ConsoleGuard>
      <Routes>
        <Route element={<ConsoleLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="products" element={<ProductsView />} />
          <Route path="orders" element={<OrdersView />} />
          <Route path="customers" element={<CustomersView />} />
          <Route path="iam" element={<IamView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ConsoleGuard>
  )
}
