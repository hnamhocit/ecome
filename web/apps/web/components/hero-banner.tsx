"use client"

import React, { useState } from "react"
import { useStore } from "@/context/store-context"
import {
  IconTruckDelivery,
  IconBuildingStore,
  IconFlame,
  IconTicket,
  IconBolt,
  IconRotateClockwise2,
  IconGift,
  IconShieldCheck,
  IconShoppingCart,
  IconCheck,
  IconCopy,
} from "@tabler/icons-react"

export function HeroBanner() {
  const { addToast } = useStore()
  const [copiedVoucher, setCopiedVoucher] = useState(false)

  const handleCopyVoucher = (code: string, discount: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedVoucher(true)
    addToast({
      title: `Đã lưu mã ${code}!`,
      message: `Giảm ${discount} cho đơn hàng từ 300k`,
      type: "success",
    })
    setTimeout(() => setCopiedVoucher(false), 2000)
  }

  const quickServices = [
    {
      title: "Freeship 0Đ",
      subtitle: "Đơn từ 300k",
      icon: IconTruckDelivery,
      color: "bg-emerald-500 text-white shadow-emerald-500/20",
    },
    {
      title: "ECOME Mall",
      subtitle: "100% Chính hãng",
      icon: IconBuildingStore,
      color: "bg-rose-500 text-white shadow-rose-500/20",
    },
    {
      title: "Deal Siêu Rẻ",
      subtitle: "Đồng giá từ 99k",
      icon: IconFlame,
      color: "bg-amber-500 text-white shadow-amber-500/20",
    },
    {
      title: "Mã Giảm Giá",
      subtitle: "Voucher tới 500k",
      icon: IconTicket,
      color: "bg-blue-500 text-white shadow-blue-500/20",
    },
    {
      title: "Giao Nhanh 2H",
      subtitle: "Nội thành hỏa tốc",
      icon: IconBolt,
      color: "bg-purple-500 text-white shadow-purple-500/20",
    },
    {
      title: "Đổi Trả 30 Ngày",
      subtitle: "Miễn phí tận nhà",
      icon: IconRotateClockwise2,
      color: "bg-teal-500 text-white shadow-teal-500/20",
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Shopee / Taobao Flagship Hero Grid (Tăng chiều cao để ảnh to rõ, không bị dẹp) */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12">
        {/* Main Banner (Left ~8 cols) with Premium 3D Tech Promotional Banner */}
        <div className="relative min-h-[340px] overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg sm:min-h-[380px] lg:col-span-8 lg:h-[400px]">
          {/* Background Premium Commercial Image */}
          <img
            src="/images/ecome_hero_banner.jpg"
            alt="ECOME Siêu Sale Thiết Bị Công Nghệ"
            className="absolute inset-0 h-full w-full object-cover object-center brightness-90 filter transition-transform duration-700 ease-out hover:scale-105"
          />
          {/* Subtle directional gradient overlay for crystal clear typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
                <span className="flex size-2 animate-ping rounded-full bg-emerald-400" />
                <span>ECOME 11.11 SIÊU SALE</span>
                <span className="text-white/40">•</span>
                <span>GIẢM ĐẾN 50%</span>
              </div>

              <h1 className="font-heading text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-3xl lg:text-4xl">
                BÙNG NỔ MUA SẮM,{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  CHẠM ĐỈNH ƯU ĐÃI
                </span>
              </h1>

              <p className="mt-2.5 max-w-lg text-xs leading-relaxed text-slate-200 drop-shadow sm:text-sm">
                Hàng ngàn sản phẩm công nghệ chính hãng giao hỏa tốc 2 giờ. Cam
                kết hoàn tiền 200% nếu phát hiện hàng giả.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#products"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-98 sm:text-sm"
              >
                <IconShoppingCart className="size-4" />
                <span>Khám phá ngay</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopyVoucher("ECOMEFAST", "50.000₫")}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-slate-950/70 px-3.5 text-xs font-semibold text-emerald-300 backdrop-blur-md transition-colors hover:bg-slate-900"
                title="Sao chép voucher"
              >
                <IconTicket className="size-4" />
                <span>
                  Mã:{" "}
                  <strong className="font-mono text-white">ECOMEFAST</strong>{" "}
                  (-50k)
                </span>
                {copiedVoucher ? (
                  <IconCheck className="size-4 text-emerald-400" />
                ) : (
                  <IconCopy className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stacked Right Cards with Real Product Photos (Tăng chiều cao lên 194px mỗi card) */}
        <div className="hidden flex-col justify-between gap-3 lg:col-span-4 lg:flex lg:h-[400px]">
          {/* Card 1: Real Hi-Fi Headset Photo with Promo Tag */}
          <div className="group relative h-[194px] overflow-hidden rounded-2xl bg-slate-900 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80&auto=format&fit=crop"
              alt="Voucher 100k"
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.5] filter transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="relative z-10 flex h-full flex-col justify-between p-4.5 text-white">
              <div>
                <span className="inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950 uppercase shadow-sm">
                  <IconGift className="size-3" stroke={2.5} />
                  VOUCHER 100K
                </span>
                <h4 className="mt-2 font-heading text-base font-bold text-white drop-shadow">
                  Ưu đãi đơn hàng đầu tiên
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-200 drop-shadow">
                  Mã:{" "}
                  <strong className="font-mono text-amber-300">ECOMEVIP</strong>
                </p>
              </div>

              {/* No harsh border line */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-300">Đơn từ 500k</span>
                <button
                  type="button"
                  onClick={() => handleCopyVoucher("ECOMEVIP", "100.000₫")}
                  className="font-bold text-amber-300 hover:underline"
                >
                  Lưu mã ngay →
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Real Smartwatch Photo with ECOME Mall Tag */}
          <div className="group relative h-[194px] overflow-hidden rounded-2xl bg-slate-900 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80&auto=format&fit=crop"
              alt="ECOME Mall"
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.5] filter transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="relative z-10 flex h-full flex-col justify-between p-4.5 text-white">
              <div>
                <span className="inline-flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-black text-white uppercase shadow-sm">
                  <IconShieldCheck className="size-3" stroke={2.5} />
                  ECOME MALL
                </span>
                <h4 className="mt-2 font-heading text-base font-bold text-white drop-shadow">
                  100% Hàng Chính Hãng
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-200 drop-shadow">
                  Bảo hành 1 đổi 1 tận nơi trong 30 ngày
                </p>
              </div>

              {/* No harsh border line */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-emerald-300">Giao 2H</span>
                <a
                  href="#products"
                  className="font-bold text-emerald-300 hover:underline"
                >
                  Xem ngay →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Shopee Benchmark: 6 Quick Service Icons Strip gọn gàng, giảm height */}
      <div className="no-scrollbar flex w-full items-center justify-between gap-3 overflow-x-auto rounded-2xl bg-card px-4 py-2.5 shadow-xs sm:grid sm:grid-cols-6 sm:px-5 sm:py-3">
        {quickServices.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.title}
              href="#products"
              className="group flex min-w-[80px] shrink-0 flex-col items-center gap-1.5 text-center transition-transform hover:-translate-y-0.5 sm:min-w-0"
            >
              <div
                className={`flex size-9.5 items-center justify-center rounded-xl shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:shadow-sm sm:size-10 ${item.color}`}
              >
                <Icon className="size-5 text-white" strokeWidth={2.2} />
              </div>
              <div className="leading-tight">
                <span className="block font-heading text-xs font-bold text-foreground transition-colors group-hover:text-primary">
                  {item.title}
                </span>
                <span className="hidden text-[10px] text-muted-foreground sm:block">
                  {item.subtitle}
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
