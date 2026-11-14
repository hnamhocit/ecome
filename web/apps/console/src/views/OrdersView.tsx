import { useState } from "react"
import {
  IconSearch,
  IconEye,
  IconCircleCheck,
  IconClock,
  IconTruck,
  IconPackage,
} from "@tabler/icons-react"

const ORDERS_DATA = [
  {
    id: "ECM-9824",
    customer: "Alex Morgan",
    email: "alex.m@example.com",
    address: "District 1, Ho Chi Minh City",
    itemsCount: 1,
    amount: "$259.00",
    paymentMethod: "VietQR (Paid)",
    status: "Delivered",
    date: "Nov 14, 2026 - 18:45",
  },
  {
    id: "ECM-9823",
    customer: "Elena Rostova",
    email: "elena@example.com",
    address: "Ba Dinh, Hanoi",
    itemsCount: 2,
    amount: "$92.00",
    paymentMethod: "VietQR (Paid)",
    status: "Processing",
    date: "Nov 14, 2026 - 18:10",
  },
  {
    id: "ECM-9822",
    customer: "Marcus Vance",
    email: "marcus.v@example.com",
    address: "Hai Chau, Da Nang",
    itemsCount: 1,
    amount: "$420.00",
    paymentMethod: "Credit Card (Paid)",
    status: "Shipped",
    date: "Nov 14, 2026 - 16:30",
  },
  {
    id: "ECM-9821",
    customer: "Sarah Jenkins",
    email: "sarah.j@example.com",
    address: "District 7, Ho Chi Minh City",
    itemsCount: 3,
    amount: "$155.00",
    paymentMethod: "COD (Pending)",
    status: "Delivered",
    date: "Nov 14, 2026 - 14:20",
  },
  {
    id: "ECM-9820",
    customer: "David Chen",
    email: "david.c@example.com",
    address: "Ngo Quyen, Hai Phong",
    itemsCount: 1,
    amount: "$80.00",
    paymentMethod: "VietQR (Paid)",
    status: "Pending",
    date: "Nov 14, 2026 - 12:05",
  },
]

export function OrdersView() {
  const [activeTab, setActiveTab] = useState("All")
  const [search, setSearch] = useState("")

  const filtered = ORDERS_DATA.filter((order) => {
    if (activeTab !== "All" && order.status !== activeTab) return false
    if (
      search.trim() &&
      !order.id.toLowerCase().includes(search.toLowerCase()) &&
      !order.customer.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Order Fulfillment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Monitor incoming customer purchases, shipping status, and delivery milestones.
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          {["All", "Pending", "Processing", "Shipped", "Delivered"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === tab
                  ? "bg-emerald-600 font-bold text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-80">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="py-4 pl-5">Order ID</th>
                <th className="py-4">Customer Details</th>
                <th className="py-4">Destination</th>
                <th className="py-4">Total Amount</th>
                <th className="py-4">Payment & Method</th>
                <th className="py-4">Status</th>
                <th className="py-4 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((order) => {
                const isDelivered = order.status === "Delivered"
                const isProcessing = order.status === "Processing"
                const isShipped = order.status === "Shipped"

                return (
                  <tr key={order.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-4 pl-5 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {order.id}
                      <span className="block text-[11px] font-normal text-slate-400">
                        {order.date}
                      </span>
                    </td>

                    <td className="py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {order.customer}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{order.email}</p>
                    </td>

                    <td className="py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {order.address}
                    </td>

                    <td className="py-4 font-heading text-sm font-black text-slate-900 dark:text-white">
                      {order.amount}
                      <span className="block text-[11px] font-normal text-slate-400">
                        {order.itemsCount} items
                      </span>
                    </td>

                    <td className="py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {order.paymentMethod}
                    </td>

                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                          isDelivered
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : isProcessing
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300"
                            : isShipped
                            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300"
                            : "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {isDelivered ? (
                          <IconCircleCheck className="size-3.5" />
                        ) : isProcessing ? (
                          <IconClock className="size-3.5" />
                        ) : isShipped ? (
                          <IconTruck className="size-3.5" />
                        ) : (
                          <IconPackage className="size-3.5" />
                        )}
                        <span>{order.status}</span>
                      </span>
                    </td>

                    <td className="py-4 pr-5 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <IconEye className="size-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
