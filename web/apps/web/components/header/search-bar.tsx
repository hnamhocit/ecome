"use client"

import { useState, useRef, useEffect } from "react"
import { IconChevronDown, IconCheck, IconX, IconSearch } from "@tabler/icons-react"
import { CATEGORIES } from "@/lib/data"

const POPULAR_SEARCHES = [
  "Sony WH-1000XM5",
  "Keychron K3 Pro",
  "Apple Watch S10",
  "Marshall Speaker",
  "Logitech MX Master 3S",
] as const

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories")

  const [isFocused, setIsFocused] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const executeSearch = (keyword: string) => {
    setIsFocused(false)
    setIsCategoryOpen(false)
    setSearchQuery(keyword)

    const target = document.getElementById("products")
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch(searchQuery)
  }

  return (
    <div ref={containerRef} className="relative max-w-3xl flex-1">
      <form
        onSubmit={handleSubmit}
        className="flex h-11 w-full items-center rounded-xl bg-white shadow-xs transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900"
      >
        {/* Category Picker */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setIsCategoryOpen((prev) => !prev)}
            className="flex h-11 items-center gap-1.5 rounded-l-xl border-r border-slate-300 bg-slate-100 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span className="max-w-[125px] truncate font-bold">{selectedCategory}</span>
            <IconChevronDown
              className={`size-3 text-slate-400 transition-transform duration-200 ${
                isCategoryOpen ? "rotate-180 text-emerald-600" : ""
              }`}
            />
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full left-0 z-50 mt-1.5 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-slate-800 shadow-xl animate-in fade-in zoom-in-95 duration-150 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              <div className="max-h-64 space-y-0.5 overflow-y-auto py-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat)
                      setIsCategoryOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-emerald-500 font-bold text-white shadow-xs"
                        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {selectedCategory === cat && (
                      <IconCheck className="ml-2 size-3.5 shrink-0 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="relative flex flex-1 items-center px-3.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search headphones, keyboards, laptops, smart gadgets..."
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm dark:text-white"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear input"
              onClick={() => setSearchQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <IconX className="size-3.5" />
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          aria-label="Search"
          className="flex h-11 w-12 items-center justify-center rounded-r-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 dark:bg-primary dark:hover:bg-primary/90"
        >
          <IconSearch className="size-4.5" />
        </button>
      </form>

      {/* Suggested Hot Searches */}
      {isFocused && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1.5 rounded-xl border border-slate-200 bg-white p-3 text-slate-800 shadow-xl animate-in fade-in slide-in-from-top-1 duration-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
          <div className="mb-2 text-[11px] font-bold text-slate-400">Trending Searches:</div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  executeSearch(item)
                }}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
