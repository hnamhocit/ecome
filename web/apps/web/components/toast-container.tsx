"use client"

import React from "react"
import Link from "next/link"
import { useStore } from "@/context/store-context"
import {
  IconCircleCheckFilled,
  IconHeartFilled,
  IconBellFilled,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react"

export function ToastContainer() {
  const { toasts, removeToast, setIsCartOpen } = useStore()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-5 bottom-5 z-50 flex max-w-sm flex-col gap-2.5"
    >
      {toasts.map((toast) => {
        const isCart = toast.type === "cart"
        const isWishlist = toast.type === "wishlist"

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex animate-in items-start gap-3 rounded-lg border border-border bg-card/95 p-3.5 text-card-foreground shadow-xl backdrop-blur-md transition-all duration-300 fade-in slide-in-from-bottom-3"
            style={{ borderRadius: "var(--radius, 0.5rem)" }}
          >
            {/* Status Icon */}
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-base ${
                isCart
                  ? "bg-trust text-trust-foreground"
                  : isWishlist
                    ? "bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400"
                    : "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
              }`}
            >
              {isCart ? (
                <IconCircleCheckFilled className="size-5 text-emerald-600" />
              ) : isWishlist ? (
                <IconHeartFilled className="size-5 text-rose-500" />
              ) : (
                <IconBellFilled className="size-5 text-amber-500" />
              )}
            </div>

            {/* Message Body */}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {toast.title}
              </div>
              {toast.message && (
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {toast.message}
                </p>
              )}
              {isCart && (
                <div className="mt-1.5 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(true)
                      removeToast(toast.id)
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                  >
                    <span>Xem giỏ hàng</span>
                    <IconArrowRight className="size-3.5" />
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <Link
                    href="/checkout"
                    onClick={() => removeToast(toast.id)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Thanh toán →
                  </Link>
                </div>
              )}
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Đóng thông báo"
            >
              <IconX className="size-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
