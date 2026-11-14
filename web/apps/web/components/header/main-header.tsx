"use client"

import { useState } from "react"
import Link from "next/link"
import { SearchBar } from "./search-bar"
import {
  IconMapPin,
  IconChevronDown,
  IconBell,
  IconBellFilled,
  IconHeart,
  IconHeartFilled,
  IconShoppingCartFilled,
} from "@tabler/icons-react"

const mockData = {
  totalCartItems: 3,
  cartSubtotal: 120460000,
  wishlistCount: 2,
  deliveryAddress: { city: "Ho Chi Minh City" },
}

function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex size-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
      >
        {unreadCount > 0 ? (
          <IconBellFilled className="size-5 text-amber-400" />
        ) : (
          <IconBell className="size-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow ring-2 ring-[#0F172A]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute top-full right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3.5 text-slate-800 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-bold dark:border-slate-800">
              <span>Notifications</span>
              <button
                type="button"
                onClick={() => {
                  setUnreadCount(0)
                  setIsOpen(false)
                }}
                className="text-[11px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Mark all as read
              </button>
            </div>
            <div className="mt-2.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Order #ECM-9824 in transit
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Courier is delivering Sony WH-1000XM5 to your address.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function MainHeader() {
  const { totalCartItems, cartSubtotal, wishlistCount, deliveryAddress } = mockData

  return (
    <div className="bg-[#0F172A] px-4 py-3.5 text-white sm:px-6 sm:py-4 lg:px-8 xl:px-10 dark:bg-[#020617]">
      <div className="mx-auto flex w-full items-center justify-between gap-3 md:gap-6">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
            <span className="font-heading text-xl font-black text-white">E</span>
          </div>
          <span className="font-heading text-2xl font-black tracking-tight text-white transition-colors group-hover:text-emerald-400 sm:text-3xl">
            ECOME
          </span>
        </Link>

        {/* Location */}
        <button
          type="button"
          onClick={() => {}}
          className="hidden h-11 shrink-0 items-center gap-2.5 rounded-xl border border-slate-700/70 bg-slate-800/60 px-3 text-left transition-colors hover:border-emerald-500/60 hover:bg-slate-800 xl:flex"
        >
          <IconMapPin className="size-4.5 shrink-0 text-emerald-400" />
          <div className="text-xs leading-tight">
            <span className="block text-[10px] text-slate-400">Deliver to:</span>
            <span className="block max-w-[130px] truncate font-semibold text-white">
              {deliveryAddress.city}
            </span>
          </div>
          <IconChevronDown className="size-3 text-slate-400" />
        </button>

        <SearchBar />

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <NotificationMenu />

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Wishlist"
            className="relative flex size-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            {wishlistCount > 0 ? (
              <IconHeartFilled className="size-5 text-rose-500" />
            ) : (
              <IconHeart className="size-5" />
            )}
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow ring-2 ring-[#0F172A]">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Cart"
            className="group flex h-11 items-center gap-2.5 rounded-xl bg-emerald-500 px-3.5 text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
          >
            <div className="relative flex items-center">
              <IconShoppingCartFilled className="size-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-2.5 flex size-4.5 items-center justify-center rounded-full bg-white text-[10px] font-black text-emerald-700 shadow">
                  {totalCartItems}
                </span>
              )}
            </div>
            <div className="hidden items-center gap-1.5 text-xs sm:flex">
              <span className="font-medium opacity-90">Cart:</span>
              <span className="font-bold tabular-nums">
                {cartSubtotal.toLocaleString()}₫
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
