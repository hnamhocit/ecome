"use client"

import React from "react"
import Link from "next/link"
import { useStore } from "@/context/store-context"
import type { Product } from "@/lib/data"
import { Card } from "@workspace/ui/components/card"
import {
  IconTruckDelivery,
  IconBolt,
  IconHeart,
  IconHeartFilled,
  IconStarFilled,
  IconFlame,
  IconClock,
} from "@tabler/icons-react"

interface ProductCardProps {
  product: Product
  isFlashDeal?: boolean
}

export function ProductCard({
  product,
  isFlashDeal: isFlashDealProp,
}: ProductCardProps) {
  const { toggleWishlist, isWishlisted } = useStore()
  const wishlisted = isWishlisted(product.id)

  // Only real Flash Deals get the "ĐANG BÁN CHẠY" progress bar!
  const isFlashDeal =
    isFlashDealProp !== undefined
      ? isFlashDealProp
      : Boolean(
          product.isFlashDeal ??
          (product.saleBadge?.toUpperCase().includes("FLASH") ||
            product.discountPercent >= 20)
        )

  // Calculate realistic selling percentage for Shopee progress bar
  const sellPercent = Math.min(
    95,
    Math.max(50, (product.reviewsCount % 50) + 45)
  )

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block h-full focus:outline-none"
    >
      <Card className="relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border-0 bg-card shadow-none transition-transform duration-200 hover:-translate-y-1">
        {/* Product Image & Badges Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800/60">
          {/* Top-Left: Clean High-Contrast Premium Badge (Chỉ 1 badge duy nhất, rõ ràng, không rối mắt) */}
          <div className="absolute top-2.5 left-2.5 z-10">
            {isFlashDeal ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                <IconBolt className="size-3" strokeWidth={2.5} />
                <span>FLASH SALE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                <IconTruckDelivery className="size-3" strokeWidth={2.5} />
                <span>FREESHIP XTRA</span>
              </span>
            )}
          </div>

          {/* Top-Right: Wishlist Button (ĐÃ XÓA HOÀN TOÀN BADGE % DISCOUNT THEO YÊU CẦU) */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(product)
              }}
              aria-label={
                wishlisted ? "Xóa khỏi yêu thích" : "Lưu vào yêu thích"
              }
              className={`flex size-8 items-center justify-center rounded-full bg-white/90 shadow-xs backdrop-blur-sm transition-all duration-200 hover:scale-110 focus:outline-none active:scale-95 dark:bg-slate-800/90 ${
                wishlisted
                  ? "text-rose-500 ring-1 ring-rose-500/30"
                  : "text-slate-400 hover:text-rose-500"
              }`}
            >
              {wishlisted ? (
                <IconHeartFilled className="animate-heart-pop size-4 text-rose-500" />
              ) : (
                <IconHeart
                  className="size-4 text-slate-500 hover:text-rose-500"
                  strokeWidth={2}
                />
              )}
            </button>
          </div>

          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Delivery Estimate Pill with Tabler SVG Icon */}
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 rounded-md bg-slate-950/75 px-2 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-sm">
            <IconClock className="size-3 text-emerald-400" strokeWidth={2.2} />
            <span>{product.deliveryEstimate}</span>
          </div>
        </div>

        {/* Product Content Details: Title TO RÕ RÀNG HƠN để cân bằng với giá */}
        <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
          <div>
            {/* 1. Rating Stars & Sold Count */}
            <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="flex items-center font-bold text-amber-500">
                <IconStarFilled className="mr-0.5 size-3.5 text-amber-500" />
                <span className="font-sans text-foreground tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span>({product.reviewsCount.toLocaleString("vi-VN")})</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[11px] font-medium text-slate-500">
                Đã bán {product.salesCount}
              </span>
            </div>

            {/* 2. Product Name: TĂNG KÍCH THƯỚC text-sm sm:text-base ĐẬM RÕ NÉT CÂN BẰNG VỚI GIÁ */}
            <h3 className="line-clamp-2 min-h-[2.8rem] font-heading text-sm leading-snug font-bold text-foreground transition-colors group-hover:text-primary sm:text-base">
              {product.name}
            </h3>

            {/* 3. Clean Price: Giá bán nổi bật + Giá gốc gạch ngang */}
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-sans text-base font-black tracking-tight text-emerald-600 tabular-nums sm:text-lg dark:text-emerald-400">
                {product.salePrice.toLocaleString("vi-VN")}₫
              </span>
              <span className="font-sans text-xs text-slate-400 tabular-nums line-through">
                {product.originalPrice.toLocaleString("vi-VN")}₫
              </span>
            </div>

            {/* 4. Shopee Flash Deal Selling Progress Bar (CHỈ HIỂN THỊ CHO FLASH SALE) */}
            {isFlashDeal && (
              <div className="relative mt-2.5 h-4 w-full overflow-hidden rounded-full bg-rose-100 dark:bg-rose-950/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${sellPercent}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center gap-1 text-[9px] font-black text-white uppercase drop-shadow-xs">
                  <IconFlame className="size-3 text-white" strokeWidth={2.5} />
                  <span>ĐANG BÁN CHẠY</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
