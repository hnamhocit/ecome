"use client"

import React from "react"
import { CategoryGrid } from "@/components/category-grid"
import { ProductShowcase } from "@/components/product-showcase"
import { Footer } from "@/components/footer"
import Header from "@/components/header"
import { HeroBanner } from "@/components/home/hero-banner"
import { QuickServices } from "@/components/home/quick-services"

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground transition-colors duration-200">
      <Header />

      <main className="w-full flex-1 space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
        <HeroBanner />

        <QuickServices />

        <CategoryGrid />

        <ProductShowcase />
      </main>

      {/* Enterprise Certified Footer */}
      <Footer />
    </div>
  )
}
