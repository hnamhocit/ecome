"use client"

import React from "react"
import { useStore } from "@/context/store-context"

interface CategoryItem {
  name: string
  image: string
  filterCategory: string
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    name: "Âm thanh & Audio",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Âm thanh & Audio",
  },
  {
    name: "Điện thoại & Tablet",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Công nghệ & Gaming",
  },
  {
    name: "Đồng hồ thông minh",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Thiết bị đeo",
  },
  {
    name: "Bàn phím cơ Gaming",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Công nghệ & Gaming",
  },
  {
    name: "Chuột công thái học",
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Công nghệ & Gaming",
  },
  {
    name: "Máy ảnh Mirrorless",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Công nghệ & Gaming",
  },
  {
    name: "Màn hình 4K",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Công nghệ & Gaming",
  },
  {
    name: "Gia dụng thông minh",
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Gia dụng thông minh",
  },
  {
    name: "Loa Bluetooth",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Âm thanh & Audio",
  },
  {
    name: "Bình giữ nhiệt OLED",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&q=80&auto=format&fit=crop",
    filterCategory: "Gia dụng thông minh",
  },
]

export function CategoryGrid() {
  const { selectedCategory, setSelectedCategory } = useStore()

  return (
    <div className="rounded-2xl bg-card px-4 py-3 shadow-xs sm:px-5 sm:py-3.5">
      {/* Shopee Style Categories Header (Gọn gàng, giảm margin) */}
      <div className="mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800/80">
        <h3 className="font-heading text-xs font-black tracking-wider text-foreground uppercase sm:text-sm">
          DANH MỤC SẢN PHẨM
        </h3>
        <button
          type="button"
          onClick={() => setSelectedCategory("Tất cả danh mục")}
          className={`text-xs font-bold transition-colors ${
            selectedCategory === "Tất cả danh mục"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {selectedCategory === "Tất cả danh mục"
            ? "Đang xem tất cả"
            : "Xem tất cả →"}
        </button>
      </div>

      {/* Shopee Style 10-Item Circular Photography Grid (Active chuẩn: chỉ highlight ảnh & chữ, KHÔNG bao khung xanh thô) */}
      <div className="no-scrollbar flex w-full gap-2 overflow-x-auto sm:grid sm:grid-cols-5 sm:gap-2 lg:grid-cols-10">
        {CATEGORY_ITEMS.map((item) => {
          const isSelected = selectedCategory === item.filterCategory

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setSelectedCategory(
                  isSelected ? "Tất cả danh mục" : item.filterCategory
                )
              }}
              className="group flex min-w-[75px] shrink-0 flex-col items-center gap-1.5 rounded-xl p-1 text-center transition-all hover:bg-slate-50 sm:min-w-0 sm:p-1.5 dark:hover:bg-slate-800/40"
            >
              {/* Circular Product Thumbnail */}
              <div
                className={`relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-slate-100 shadow-xs transition-all duration-300 group-hover:scale-105 sm:size-12 dark:bg-slate-800 ${
                  isSelected
                    ? "scale-105 shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-card"
                    : "group-hover:ring-1 group-hover:ring-slate-300 dark:group-hover:ring-slate-600"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Category Name */}
              <span
                className={`line-clamp-2 max-w-[75px] text-[10px] leading-tight sm:max-w-none sm:text-[11px] ${
                  isSelected
                    ? "font-bold text-primary"
                    : "font-semibold text-foreground transition-colors group-hover:text-primary"
                }`}
              >
                {item.name}
              </span>

              {/* Active Indicator Bar (Thanh gạch nhỏ tinh tế thay vì đóng khung xanh) */}
              {isSelected ? (
                <span className="h-0.5 w-4 rounded-full bg-primary" />
              ) : (
                <span className="h-0.5 w-4 opacity-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
