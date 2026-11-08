"use client"

import React, { useMemo, useState, useEffect } from "react"
import { useStore } from "@/context/store-context"
import { PRODUCTS } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import { IconFlame, IconSparkles, IconSearchOff } from "@tabler/icons-react"

export function ProductShowcase() {
  const { searchQuery, selectedCategory, setSelectedCategory } = useStore()

  // Live Flash Sale Countdown Timer (Shopee style)
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 59,
    seconds: 36,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 2, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Flash Deal products (CHỈ CHO KHỐI FLASH DEAL - 6 sản phẩm)
  const flashProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.isFlashDeal)
  }, [])

  // Remaining products (CÁC SẢN PHẨM CÒN LẠI CHO SECTION HÔM NAY - 6 sản phẩm)
  const remainingProducts = useMemo(() => {
    return PRODUCTS.filter((p) => !p.isFlashDeal)
  }, [])

  // Filter products by category and search query from store
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (
        selectedCategory !== "Tất cả danh mục" &&
        p.category !== selectedCategory
      ) {
        return false
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = p.name.toLowerCase().includes(query)
        const matchBrand = p.brand.toLowerCase().includes(query)
        const matchCat = p.category.toLowerCase().includes(query)
        if (!matchName && !matchBrand && !matchCat) return false
      }
      return true
    })
  }, [selectedCategory, searchQuery])

  const isFiltering =
    selectedCategory !== "Tất cả danh mục" || Boolean(searchQuery.trim())

  // Khi ở trang chủ: đưa các sản phẩm còn lại vào section Hôm Nay (không trùng với Flash Deal)
  // Khi người dùng tìm kiếm hoặc chọn danh mục: hiển thị kết quả lọc
  const catalogProducts = isFiltering ? filteredProducts : remainingProducts

  return (
    <div id="products" className="scroll-mt-14 space-y-12 sm:space-y-16">
      {/* ============================================================== */}
      {/* 1. SECTION: FLASH DEAL HÔM NAY (MỘT KHỐI BG TRẮNG ĐỒNG NHẤT)   */}
      {/* Cả Header và 6 sản phẩm Flash Sale đều nằm trọn trong bg-card  */}
      {/* ============================================================== */}
      {!isFiltering && (
        <section className="rounded-2xl bg-card p-4 shadow-xs sm:p-6">
          {/* Flash Deal Header Bar (Phần đầu khối Flash Sale) */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800/80">
            <div className="flex flex-wrap items-center gap-3">
              {/* Flash Sale Badge */}
              <div className="flex items-center gap-2 font-heading text-base font-black tracking-tight text-rose-600 sm:text-xl">
                <span className="flex size-7 items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs">
                  <IconFlame className="size-4.5" />
                </span>
                <span>FLASH DEAL HÔM NAY</span>
              </div>

              {/* Countdown Timer Blocks (Shopee pattern: 02 : 59 : 36) */}
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
                <span className="flex size-7 items-center justify-center rounded-md bg-slate-900 tabular-nums shadow-xs dark:bg-slate-800">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="font-sans text-slate-800 dark:text-slate-200">
                  :
                </span>
                <span className="flex size-7 items-center justify-center rounded-md bg-slate-900 tabular-nums shadow-xs dark:bg-slate-800">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="font-sans text-slate-800 dark:text-slate-200">
                  :
                </span>
                <span className="flex size-7 items-center justify-center rounded-md bg-rose-600 tabular-nums shadow-xs">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>

              <span className="hidden text-xs text-muted-foreground lg:inline">
                • Kết thúc sau {timeLeft.hours} giờ {timeLeft.minutes} phút
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="rounded-full bg-rose-50 px-3 py-1 font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                {flashProducts.length} deal giới hạn
              </span>
              <a
                href="#all-products"
                className="font-bold text-rose-600 transition-colors hover:text-rose-700 hover:underline"
              >
                Xem tất cả &gt;
              </a>
            </div>
          </div>

          {/* Flash Deal Products Grid (Nằm TRỰC TIẾP trong khối trắng của Flash Deal) */}
          <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
            {flashProducts.map((product) => (
              <ProductCard
                key={`flash-${product.id}`}
                product={product}
                isFlashDeal={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 2. SECTION: SẢN PHẨM BÌNH THƯỜNG / GỢI Ý HÔM NAY                */}
      {/* Tách xa Flash Deal, có tiêu đề thanh thoát chuẩn quốc tế        */}
      {/* ============================================================== */}
      <section
        id="all-products"
        className="scroll-mt-14 space-y-5 pt-2 sm:pt-4"
      >
        {/* Clean Typography Title & Subtitle */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-primary" />
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-2xl">
              {isFiltering
                ? searchQuery
                  ? `KẾT QUẢ TÌM KIẾM: "${searchQuery}"`
                  : `DANH MỤC: ${selectedCategory.toUpperCase()}`
                : "GỢI Ý HÔM NAY"}
            </h2>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              • Tuyển chọn sản phẩm chính hãng dành cho bạn
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium">
              {catalogProducts.length} sản phẩm
            </span>
            {isFiltering && (
              <button
                type="button"
                onClick={() => setSelectedCategory("Tất cả danh mục")}
                className="font-bold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                ← Xem tất cả
              </button>
            )}
          </div>
        </div>

        {/* Regular Products Grid: Tất cả sản phẩm ở đây là SẢN PHẨM BÌNH THƯỜNG (isFlashDeal={false}) */}
        {catalogProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card py-16 text-center shadow-xs">
            <IconSearchOff className="mb-3 size-10 text-muted-foreground" />
            <h4 className="font-heading text-lg font-bold text-foreground">
              Không tìm thấy sản phẩm nào
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Thử tìm kiếm với từ khóa khác hoặc bấm xem tất cả danh mục.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory("Tất cả danh mục")}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 sm:text-sm"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5 2xl:grid-cols-6">
            {catalogProducts.map((product) => (
              <ProductCard
                key={`catalog-${product.id}`}
                product={product}
                isFlashDeal={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
