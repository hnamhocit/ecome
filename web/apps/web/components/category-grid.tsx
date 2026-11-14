"use client"

import React, { useState } from "react"
import clsx from "clsx"

interface CategoryItem {
  name: string
  image: string
  filterCategory: string
}

const CATEGORY_ITEMS: CategoryItem[] = [
  { name: "Audio & Acoustics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80&auto=format&fit=crop", filterCategory: "Audio & Acoustics" },
  { name: "Phones & Tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80&auto=format&fit=crop", filterCategory: "Computers & Gaming" },
  { name: "Smartwatches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80&auto=format&fit=crop", filterCategory: "Wearables" },
  { name: "Gaming Keyboards", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=80&auto=format&fit=crop", filterCategory: "Computers & Gaming" },
  { name: "Ergonomic Mice", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&q=80&auto=format&fit=crop", filterCategory: "Computers & Gaming" },
  { name: "Mirrorless Cameras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80&auto=format&fit=crop", filterCategory: "Computers & Gaming" },
  { name: "4K Monitors", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80&auto=format&fit=crop", filterCategory: "Computers & Gaming" },
  { name: "Smart Home", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200&q=80&auto=format&fit=crop", filterCategory: "Smart Home" },
  { name: "Bluetooth Speakers", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80&auto=format&fit=crop", filterCategory: "Audio & Acoustics" },
  { name: "Smart Gadgets", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&q=80&auto=format&fit=crop", filterCategory: "Smart Home" },
]

export function CategoryGrid() {
  const [selectedCategory, setSelectedCategory] = useState("")

  return (
    <div className="rounded-2xl bg-card px-4 py-4 shadow-xs sm:px-5 sm:py-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800/80">
        <h3 className="font-heading text-xs font-black tracking-wider text-foreground uppercase sm:text-sm">
          SHOP BY CATEGORY
        </h3>
        <button
          type="button"
          onClick={() => setSelectedCategory("All Categories")}
          className={clsx(
            "text-xs font-bold transition-colors",
            selectedCategory === "All Categories"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {selectedCategory === "All Categories" ? "Viewing All" : "View all →"}
        </button>
      </div>

      {/* Grid Items */}
      <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:gap-3 lg:grid-cols-10 sm:pb-0">
        {CATEGORY_ITEMS.map((item) => {
          const isSelected = selectedCategory === item.filterCategory

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setSelectedCategory(isSelected ? "All Categories" : item.filterCategory)}
              className="group flex min-w-[72px] shrink-0 flex-col items-center gap-2 rounded-xl p-1.5 text-center transition-all hover:bg-slate-50 sm:min-w-0 dark:hover:bg-slate-800/40"
            >
              {/* Image Wrapper */}
              <div
                className={clsx(
                  "relative flex size-12 items-center justify-center overflow-hidden rounded-full bg-slate-100 transition-all duration-300 group-hover:scale-105 sm:size-[52px] dark:bg-slate-800",
                  {
                    "scale-105 shadow-xs ring-2 ring-primary ring-offset-2 ring-offset-card": isSelected,
                    "shadow-xs group-hover:ring-2 group-hover:ring-slate-200 dark:group-hover:ring-slate-700": !isSelected,
                  }
                )}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Text Label */}
              <span
                className={clsx(
                  "line-clamp-2 max-w-[75px] text-[11px] leading-tight sm:max-w-none sm:text-xs",
                  isSelected
                    ? "font-bold text-primary"
                    : "font-semibold text-foreground transition-colors group-hover:text-primary"
                )}
              >
                {item.name}
              </span>

              {/* Active Indicator Bar */}
              <span
                className={clsx(
                  "h-0.5 w-4 rounded-full transition-all duration-300",
                  isSelected ? "bg-primary" : "bg-transparent opacity-0"
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
