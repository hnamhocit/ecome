"use client"

import React, { useState } from "react"
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
import type { Product } from "@/lib/data"

const MOCK_PRODUCT: Product = {
  id: "1",
  name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones - Black",
  brand: "Sony",
  category: "Audio & Acoustics",
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  rating: 4.9,
  reviewsCount: 1250,
  salesCount: "1.2k+",
  salePrice: 6490000,
  originalPrice: 8490000,
  deliveryEstimate: "Delivers Tomorrow",
  discountPercent: 24,
  saleBadge: "FLASH SALE",
  trustBadge: "Free Shipping",
  inStock: true,
  description: "Industry leading noise canceling headphones.",
  specs: [],
}

export interface ProductCardProps {
  product?: Partial<Product> & {
    id: string
    name: string
    image: string
    rating: number
    reviewsCount: number
    salesCount: string
    salePrice: number
    originalPrice: number
    deliveryEstimate?: string
    discountPercent?: number
    saleBadge?: string
    isFlashDeal?: boolean
  }
  isFlashDeal?: boolean
}

export function ProductCard({
  product = MOCK_PRODUCT,
  isFlashDeal: isFlashDealProp,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)

  const isFlashDeal =
    isFlashDealProp !== undefined
      ? isFlashDealProp
      : Boolean(
          product.isFlashDeal ??
            (product.saleBadge?.toUpperCase().includes("FLASH") ||
              (product.discountPercent ?? 0) >= 20)
        )

  const sellPercent = Math.min(
    95,
    Math.max(50, (product.reviewsCount % 50) + 45)
  )

  return (
    <div className="group block h-full focus:outline-none">
      <Card className="relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        {/* Product Image & Badges Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800/60">
          {/* Top-Left: Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            {isFlashDeal ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs">
                <IconBolt className="size-3" strokeWidth={2.5} />
                <span>FLASH SALE</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs">
                <IconTruckDelivery className="size-3" strokeWidth={2.5} />
                <span>FREE SHIPPING</span>
              </span>
            )}
          </div>

          {/* Top-Right: Wishlist Button */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <button
              type="button"
              aria-label="Add to wishlist"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setWishlisted(!wishlisted)
              }}
              className={`flex size-8 items-center justify-center rounded-full bg-white/90 shadow-xs backdrop-blur-xs transition-all duration-200 hover:scale-110 focus:outline-none active:scale-95 dark:bg-slate-800/90 ${
                wishlisted
                  ? "text-rose-500 ring-1 ring-rose-500/30"
                  : "text-slate-400 hover:text-rose-500"
              }`}
            >
              {wishlisted ? (
                <IconHeartFilled className="size-4 text-rose-500 animate-in zoom-in duration-200" />
              ) : (
                <IconHeart className="size-4" strokeWidth={2} />
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

          {/* Delivery Estimate Pill */}
          {product.deliveryEstimate && (
            <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 rounded-md bg-slate-950/75 px-2 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-xs">
              <IconClock className="size-3 text-emerald-400" strokeWidth={2.2} />
              <span>{product.deliveryEstimate}</span>
            </div>
          )}
        </div>

        {/* Product Content Details */}
        <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
          <div>
            {/* Rating Stars & Sold Count */}
            <div className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center font-bold text-amber-500">
                <IconStarFilled className="mr-0.5 size-3.5" />
                <span className="font-sans text-slate-900 tabular-nums dark:text-slate-100">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span>({product.reviewsCount.toLocaleString()})</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[11px] font-medium">
                {product.salesCount} sold
              </span>
            </div>

            {/* Product Name */}
            <h3 className="line-clamp-2 min-h-[2.8rem] font-heading text-sm leading-snug font-bold text-slate-900 transition-colors group-hover:text-emerald-600 sm:text-base dark:text-slate-100 dark:group-hover:text-emerald-400">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-sans text-base font-black tracking-tight text-emerald-600 tabular-nums sm:text-lg dark:text-emerald-400">
                {product.salePrice.toLocaleString()}₫
              </span>
              <span className="font-sans text-xs text-slate-400 tabular-nums line-through dark:text-slate-500">
                {product.originalPrice.toLocaleString()}₫
              </span>
            </div>

            {/* Flash Deal Selling Progress Bar */}
            {isFlashDeal && (
              <div className="relative mt-2.5 h-4 w-full overflow-hidden rounded-full bg-rose-100 dark:bg-rose-950/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${sellPercent}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center gap-1 text-[9px] font-black text-white uppercase drop-shadow-xs">
                  <IconFlame className="size-3 text-white" strokeWidth={2.5} />
                  <span>SELLING FAST</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
