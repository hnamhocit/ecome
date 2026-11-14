"use client"

import React, { useMemo, useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { IconFlame, IconSearchOff, IconSearch } from "@tabler/icons-react"
import { PRODUCTS, CATEGORIES } from "@/lib/data"

export function ProductShowcase() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  // Live Flash Sale Countdown Timer
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
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 2, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const flashProducts = useMemo(() => PRODUCTS.filter((p) => p.isFlashDeal), [])
  const remainingProducts = useMemo(() => PRODUCTS.filter((p) => !p.isFlashDeal), [])

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== "All Categories" && p.category !== selectedCategory) return false
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

  const isFiltering = selectedCategory !== "All Categories" || Boolean(searchQuery.trim())
  const catalogProducts = isFiltering ? filteredProducts : remainingProducts

  return (
    <div id="products" className="scroll-mt-14 space-y-12 sm:space-y-16">
      {/* Category & Search Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
            Filter:
          </span>
          <select
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Quick filter products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pr-3 pl-9 text-xs text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* 1. Flash Deals Section */}
      {!isFiltering && flashProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 pb-3 dark:border-rose-950/60">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-xs">
                <IconFlame className="size-4 animate-bounce" />
                <span>FLASH DEALS</span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
                <span className="flex size-7 items-center justify-center rounded-md bg-slate-900 tabular-nums shadow-xs dark:bg-slate-800">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="font-sans text-slate-800 dark:text-slate-200">:</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-slate-900 tabular-nums shadow-xs dark:bg-slate-800">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="font-sans text-slate-800 dark:text-slate-200">:</span>
                <span className="flex size-7 items-center justify-center rounded-md bg-rose-600 tabular-nums shadow-xs">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>

              <span className="hidden text-xs text-slate-500 lg:inline dark:text-slate-400">
                • Ends in {timeLeft.hours}h {timeLeft.minutes}m
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="rounded-full bg-rose-50 px-3 py-1 font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                {flashProducts.length} limited deals
              </span>
              <a
                href="#all-products"
                className="font-bold text-rose-600 transition-colors hover:text-rose-700 hover:underline"
              >
                View all &gt;
              </a>
            </div>
          </div>

          {/* Flash Deal Products Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
            {flashProducts.map((product) => (
              <ProductCard key={`flash-${product.id}`} product={product} isFlashDeal={true} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Main Products Catalog Section */}
      <section id="all-products" className="scroll-mt-14 space-y-5 pt-2 sm:pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-emerald-500" />
            <h2 className="font-heading text-lg font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              {isFiltering
                ? searchQuery
                  ? `SEARCH RESULTS: "${searchQuery}"`
                  : `CATEGORY: ${selectedCategory.toUpperCase()}`
                : "TODAY'S PICKS"}
            </h2>
            <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
              • Official tech products curated for you
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">{catalogProducts.length} products</span>
            {isFiltering && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All Categories")
                  setSearchQuery("")
                }}
                className="font-bold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                ← View all
              </button>
            )}
          </div>
        </div>

        {catalogProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <IconSearchOff className="mb-3 size-10 text-slate-400 dark:text-slate-500" />
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              No products found
            </h4>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try searching with different keywords or reset your category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All Categories")
                setSearchQuery("")
              }}
              className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 sm:text-sm"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
            {catalogProducts.map((product) => (
              <ProductCard key={`catalog-${product.id}`} product={product} isFlashDeal={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
