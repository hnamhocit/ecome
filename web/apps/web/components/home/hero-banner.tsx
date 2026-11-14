"use client"

import { useState } from "react"
import {
  IconTicket,
  IconGift,
  IconShieldCheck,
  IconShoppingCart,
  IconCheck,
  IconCopy,
} from "@tabler/icons-react"

export function HeroBanner() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev))
    }, 2000)
  }

  return (
    <section
      aria-label="Promotional Highlights"
      className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12"
    >
      {/* Main Banner (Left 8 cols) */}
      <div className="relative min-h-[340px] overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg sm:min-h-[380px] lg:col-span-8 lg:h-[400px]">
        <img
          src="/images/ecome_hero_banner.jpg"
          alt="ECOME Mega Tech Sale"
          className="absolute inset-0 h-full w-full object-cover object-center brightness-90 filter transition-transform duration-700 ease-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
              <span className="flex size-2 animate-ping rounded-full bg-emerald-400" />
              <span>ECOME 11.11 MEGA SALE</span>
              <span className="text-white/40">•</span>
              <span>UP TO 50% OFF</span>
            </div>

            <h1 className="font-heading text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-3xl lg:text-4xl">
              EXPLOSIVE DEALS,{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                PEAK SAVINGS
              </span>
            </h1>

            <p className="mt-2.5 max-w-lg text-xs leading-relaxed text-slate-200 drop-shadow sm:text-sm">
              Thousands of genuine tech products with 2-hour express delivery. 200% refund guarantee on counterfeit goods.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#products"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-98 sm:text-sm"
            >
              <IconShoppingCart className="size-4" />
              <span>Explore Deals</span>
            </a>

            <button
              type="button"
              onClick={() => handleCopyVoucher("ECOMEFAST")}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-slate-950/70 px-3.5 text-xs font-semibold text-emerald-300 backdrop-blur-md transition-colors hover:bg-slate-900"
              title="Copy voucher code"
            >
              <IconTicket className="size-4" />
              <span>
                Code: <strong className="font-mono text-white">ECOMEFAST</strong>{" "}
                (-$2)
              </span>
              {copiedCode === "ECOMEFAST" ? (
                <IconCheck className="size-4 text-emerald-400" />
              ) : (
                <IconCopy className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stacked Right Cards (Right 4 cols) */}
      <div className="hidden flex-col justify-between gap-3 lg:col-span-4 lg:flex lg:h-[400px]">
        {/* Card 1 */}
        <div className="group relative h-[194px] overflow-hidden rounded-2xl bg-slate-900 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80&auto=format&fit=crop"
            alt="New Member Voucher"
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.5] filter transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="relative z-10 flex h-full flex-col justify-between p-4.5 text-white">
            <div>
              <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase shadow-xs">
                <IconGift className="size-3" stroke={2.5} />
                WELCOME $5 VOUCHER
              </span>
              <h4 className="mt-2 font-heading text-base font-bold text-white drop-shadow-xs">
                First Order Discount
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-200 drop-shadow-xs">
                Code: <strong className="font-mono text-amber-300">ECOMEVIP</strong>
              </p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-300">Orders over $20</span>
              <button
                type="button"
                onClick={() => handleCopyVoucher("ECOMEVIP")}
                className="font-bold text-amber-300 hover:underline"
              >
                {copiedCode === "ECOMEVIP" ? "Claimed ✓" : "Claim Voucher →"}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative h-[194px] overflow-hidden rounded-2xl bg-slate-900 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80&auto=format&fit=crop"
            alt="ECOME Mall"
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.5] filter transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="relative z-10 flex h-full flex-col justify-between p-4.5 text-white">
            <div>
              <span className="inline-flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-black text-white uppercase shadow-xs">
                <IconShieldCheck className="size-3" stroke={2.5} />
                ECOME MALL
              </span>
              <h4 className="mt-2 font-heading text-base font-bold text-white drop-shadow-xs">
                100% Genuine Guaranteed
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-200 drop-shadow-xs">
                30-day free 1-to-1 replacement
              </p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-emerald-300">2H Express</span>
              <a
                href="#products"
                className="font-bold text-emerald-300 hover:underline"
              >
                Shop Mall →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
