import { useState } from "react"
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconDotsVertical,
  IconCircleCheck,
  IconAlertTriangle,
  IconExternalLink,
} from "@tabler/icons-react"
import { Select } from "../components/ui/Select"

const PRODUCTS_DATA = [
  {
    id: "ecome-sony-wh1000xm5",
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Audio & Acoustics",
    sku: "SNY-WH5-BLK",
    price: "$259.00",
    stock: 42,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80",
  },
  {
    id: "ecome-keychron-k3-pro",
    name: "Keychron K3 Pro Custom Keyboard",
    category: "Computers & Gaming",
    sku: "KYC-K3P-RGB",
    price: "$92.00",
    stock: 18,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=120&q=80",
  },
  {
    id: "ecome-apple-watch-s10",
    name: "Apple Watch Series 10 GPS 46mm",
    category: "Wearables",
    sku: "APL-W10-46",
    price: "$420.00",
    stock: 5,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&q=80",
  },
  {
    id: "ecome-marshall-emberton-2",
    name: "Marshall Emberton II Portable Speaker",
    category: "Audio & Acoustics",
    sku: "MSH-EMB-II",
    price: "$155.00",
    stock: 24,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=120&q=80",
  },
  {
    id: "ecome-logitech-mx-master-3s",
    name: "Logitech MX Master 3S Mouse",
    category: "Computers & Gaming",
    sku: "LOG-MX3S-GRY",
    price: "$80.00",
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=120&q=80",
  },
  {
    id: "ecome-fujifilm-x-t50",
    name: "Fujifilm X-T50 Mirrorless Camera Kit",
    category: "Computers & Gaming",
    sku: "FJI-XT50-BLK",
    price: "$1,340.00",
    stock: 8,
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120&q=80",
  },
]

const CATEGORY_OPTIONS = [
  { value: "All", label: "All Categories" },
  { value: "Audio & Acoustics", label: "Audio & Acoustics" },
  { value: "Computers & Gaming", label: "Computers & Gaming" },
  { value: "Wearables", label: "Wearables" },
]

export function ProductsView() {
  const [search, setSearch] = useState("")
  const [selectedCat, setSelectedCat] = useState("All")

  const filtered = PRODUCTS_DATA.filter((p) => {
    if (selectedCat !== "All" && p.category !== selectedCat) return false
    if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Product Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your store catalog, real-time pricing, stock quantities, and listings.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 active:scale-95"
        >
          <IconPlus className="size-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
        <div className="relative min-w-[280px] flex-1 sm:max-w-md">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <IconFilter className="size-4 text-slate-400" />
          <Select
            value={selectedCat}
            onChange={setSelectedCat}
            options={CATEGORY_OPTIONS}
            className="w-48"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="py-4 pl-5">Product Details</th>
                <th className="py-4">Category</th>
                <th className="py-4">SKU</th>
                <th className="py-4">Unit Price</th>
                <th className="py-4">Stock Status</th>
                <th className="py-4 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((item) => {
                const inStock = item.status === "In Stock"
                const lowStock = item.status === "Low Stock"

                return (
                  <tr key={item.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-4 pl-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-800"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </p>
                          <span className="font-mono text-xs text-slate-400">
                            ID: {item.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {item.category}
                    </td>

                    <td className="py-4 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {item.sku}
                    </td>

                    <td className="py-4 font-heading text-sm font-black text-slate-900 dark:text-white">
                      {item.price}
                    </td>

                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        {inStock ? (
                          <IconCircleCheck className="size-4 text-emerald-500" />
                        ) : lowStock ? (
                          <IconAlertTriangle className="size-4 text-amber-500" />
                        ) : (
                          <IconAlertTriangle className="size-4 text-rose-500" />
                        )}
                        <span
                          className={`text-xs font-bold ${
                            inStock
                              ? "text-emerald-600 dark:text-emerald-400"
                              : lowStock
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {item.stock} left ({item.status})
                        </span>
                      </div>
                    </td>

                    <td className="py-4 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`http://localhost:3000/product/${item.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                          title="View on Storefront"
                        >
                          <IconExternalLink className="size-4" />
                        </a>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          <IconDotsVertical className="size-4" />
                        </button>
                      </div>
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
