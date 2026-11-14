"use client"

import {
  IconMenu2,
  IconFlame,
  IconTruckDelivery,
  IconShieldCheck,
} from "@tabler/icons-react"

export function SubNav() {
  return (
    <div className="border-t border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-200 sm:px-6 lg:px-8 xl:px-10 dark:bg-slate-950">
      <div className="no-scrollbar flex w-full items-center justify-between gap-4 overflow-x-auto">
        <div className="flex shrink-0 items-center gap-4">
          <a
            href="#products"
            className="flex items-center gap-1.5 py-0.5 font-bold text-white hover:text-emerald-400"
          >
            <IconMenu2 className="size-3.5" />
            <span>All Categories</span>
          </a>
          <span className="text-slate-700">|</span>
          <a
            href="#products"
            className="flex items-center gap-1 font-semibold text-slate-200 hover:text-white"
          >
            <IconFlame className="size-3.5 text-amber-400" />
            <span>Flash Deals</span>
            <span className="rounded border border-rose-500/30 bg-rose-500/20 px-1 py-0.5 text-[10px] font-bold text-rose-400">
              -33%
            </span>
          </a>
          <a
            href="#products"
            className="hidden font-medium text-slate-300 hover:text-white sm:inline"
          >
            Best Sellers
          </a>
          <a
            href="#products"
            className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300"
          >
            <IconTruckDelivery className="size-3.5" />
            <span>Free Shipping</span>
          </a>
          <a
            href="#products"
            className="hidden font-medium text-slate-300 hover:text-white md:inline"
          >
            100% Genuine
          </a>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <IconShieldCheck className="size-3.5 text-emerald-400" />
          <span className="hidden sm:inline">SSL Secure Checkout</span>
        </div>
      </div>
    </div>
  )
}
