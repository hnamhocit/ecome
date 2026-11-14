import Link from "next/link"
import { IconTicket, IconSparkles } from "@tabler/icons-react"

export default function VouchersPage() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
        <IconTicket className="size-7" />
      </div>
      <h2 className="mt-4 font-heading text-lg font-bold text-slate-900 dark:text-white">
        No active vouchers
      </h2>
      <p className="mt-1.5 max-w-sm text-xs text-slate-500 dark:text-slate-400">
        You currently have no promotional discount codes. Stay tuned for upcoming promotional events!
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      >
        <IconSparkles className="size-4" />
        <span>Explore Promotions</span>
      </Link>
    </div>
  )
}
