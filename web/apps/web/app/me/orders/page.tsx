import Link from "next/link"
import { IconReceipt2, IconShoppingBag } from "@tabler/icons-react"

export default function OrdersPage() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
        <IconReceipt2 className="size-7" />
      </div>
      <h2 className="mt-4 font-heading text-lg font-bold text-slate-900 dark:text-white">
        No orders found
      </h2>
      <p className="mt-1.5 max-w-sm text-xs text-slate-500 dark:text-slate-400">
        You haven&apos;t placed any orders yet. Start exploring our latest tech and electronics deals today!
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-95"
      >
        <IconShoppingBag className="size-4" />
        <span>Start Shopping</span>
      </Link>
    </div>
  )
}
