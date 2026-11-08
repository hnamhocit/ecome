"use client"

import React from "react"
import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { CategoryGrid } from "@/components/category-grid"
import { ProductShowcase } from "@/components/product-showcase"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground transition-colors duration-200">
      {/* Amazon Pro Style Expanded Header */}
      <Header />

      {/* Main Fluid Storefront with generous spacing */}
      <main className="w-full flex-1 space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        {/* Shopee Flagship Hero: Main Banner + Stacked Side Banners + 6 Services */}
        <HeroBanner />

        {/* Shopee Flagship Category Grid: 10 Circular Photo Thumbnails */}
        <CategoryGrid />

        {/* Shopee Flagship Flash Deal Section & Product Catalog */}
        <ProductShowcase />
      </main>

      {/* Enterprise Certified Footer */}
      <Footer />
    </div>
  )
}
