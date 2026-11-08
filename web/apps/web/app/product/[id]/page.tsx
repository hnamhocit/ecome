"use client"

import React, { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useStore } from "@/context/store-context"
import {
  PRODUCTS,
  getProductById,
  getRelatedProducts,
  type Product,
} from "@/lib/data"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { cn } from "@workspace/ui/lib/utils"
import {
  IconMessageFilled,
  IconBuildingStore,
  IconStarFilled,
  IconHeart,
  IconHeartFilled,
  IconShoppingCartFilled,
  IconBolt,
  IconBoltFilled,
  IconShieldCheck,
  IconShieldCheckFilled,
  IconTruckDelivery,
  IconRotateClockwise2,
  IconThumbUp,
  IconChevronRight,
  IconZoomIn,
  IconMinus,
  IconPlus,
  IconLink,
  IconBrandFacebook,
  IconCheck,
  IconCircleCheckFilled,
  IconAward,
  IconDiscount2,
  IconPhoto,
} from "@tabler/icons-react"

function ProductDetailContent() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string

  const {
    addToCart,
    setCheckoutProduct,
    toggleWishlist,
    isWishlisted,
    deliveryAddress,
    setIsDeliveryModalOpen,
    addToast,
  } = useStore()

  // Find current product or fallback to first product
  const product: Product = useMemo(() => {
    return getProductById(productId) || PRODUCTS[0]!
  }, [productId])

  const wishlisted = isWishlisted(product.id)
  const relatedProducts = useMemo(
    () => getRelatedProducts(product, 6),
    [product]
  )

  // Media gallery images
  const galleryImages = useMemo(() => {
    return (
      product.images || [
        product.image,
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80&auto=format&fit=crop",
      ]
    )
  }, [product])

  const [selectedImage, setSelectedImage] = useState(0)

  // Color / Variant Options
  const colorOptions = useMemo(() => {
    return (
      product.colors || [
        { name: "Đen Titan (Black Edition)", hex: "#1E293B", stock: 32 },
        { name: "Bạc Ánh Kim (Silver Chrome)", hex: "#CBD5E1", stock: 18 },
        { name: "Xanh Rêu ECOME (Emerald Pro)", hex: "#059669", stock: 24 },
      ]
    )
  }, [product])

  const [selectedColor, setSelectedColor] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)

  // Interactive Review Likes state
  const [reviewLikes, setReviewLikes] = useState<{ [key: string]: number }>({
    rev1: 52,
    rev2: 34,
    rev3: 19,
  })
  const [likedReviews, setLikedReviews] = useState<{ [key: string]: boolean }>(
    {}
  )
  const [reviewFilter, setReviewFilter] = useState<
    "all" | "5star" | "hasMedia"
  >("all")

  const handleToggleLikeReview = (reviewId: string) => {
    if (likedReviews[reviewId]) {
      setReviewLikes((prev) => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 1) - 1,
      }))
      setLikedReviews((prev) => ({ ...prev, [reviewId]: false }))
    } else {
      setReviewLikes((prev) => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 0) + 1,
      }))
      setLikedReviews((prev) => ({ ...prev, [reviewId]: true }))
      addToast({
        title: "Cảm ơn bạn!",
        message: "Đánh giá của bạn đã được ghi nhận là hữu ích",
        type: "success",
      })
    }
  }

  const selectedVariantName = colorOptions[selectedColor]?.name || "Tiêu chuẩn"

  const handleAddToCart = () => {
    addToCart(product, quantity, true, selectedVariantName)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity, false, selectedVariantName)
    setCheckoutProduct(product)
    router.push("/checkout")
  }

  const handleSaveVoucher = (code: string, discount: string) => {
    navigator.clipboard?.writeText(code)
    addToast({
      title: `Đã lưu mã ${code}!`,
      message: `Giảm ${discount} áp dụng tự động khi thanh toán`,
      type: "success",
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground transition-colors duration-200">
      {/* Sticky Header with Search, Cart & Logged-In User Profile */}
      <Header />

      {/* Fluid Full-Width Container matching storefront */}
      <main className="w-full flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="w-full space-y-8 sm:space-y-10">
          {/* 1. Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Trang chủ
            </Link>
            <IconChevronRight className="size-3.5 text-slate-400" />
            <Link href="/" className="transition-colors hover:text-primary">
              {product.category}
            </Link>
            <IconChevronRight className="size-3.5 text-slate-400" />
            <span className="max-w-md truncate font-semibold text-foreground">
              {product.name}
            </span>
          </nav>

          {/* 2. Main Product Showcase Box (Media Gallery + Buy Box) */}
          <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
              {/* Left Column: Media Gallery */}
              <div className="w-full space-y-4 lg:col-span-5 xl:col-span-4 2xl:col-span-4 max-w-[500px]">
                {/* Main Large Image Display */}
                <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted/30">
                  <img
                    src={galleryImages[selectedImage] || product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Top-Left: Clean High-Contrast Mall / Flash Sale Badge */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    {product.isFlashDeal ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-black text-white shadow-sm">
                        <IconBolt className="size-3.5" strokeWidth={2.5} />
                        <span>FLASH SALE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-black text-white shadow-sm">
                        <IconTruckDelivery
                          className="size-3.5"
                          strokeWidth={2.5}
                        />
                        <span>FREESHIP XTRA</span>
                      </span>
                    )}
                  </div>

                  {/* Zoom Hint */}
                  <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-lg bg-slate-950/70 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <IconZoomIn className="size-3.5" />
                    <span>Rê chuột phóng to</span>
                  </div>
                </div>

                {/* Thumbnails Strip */}
                <div className="no-scrollbar flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`relative size-18 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        selectedImage === idx
                          ? "border-foreground shadow-none"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Ảnh chi tiết ${idx + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>

                {/* Action Strip: Share & Wishlist */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-muted-foreground dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span>Chia sẻ:</span>
                    <button
                      type="button"
                      onClick={() =>
                        addToast({
                          title: "Đã sao chép liên kết!",
                          message: "Link sản phẩm đã được lưu vào clipboard",
                          type: "success",
                        })
                      }
                      className="flex items-center gap-1 font-medium transition-colors hover:text-primary"
                      title="Sao chép link"
                    >
                      <IconLink className="size-4" />
                      <span>Sao chép link</span>
                    </button>
                    <a
                      href="#"
                      className="text-[#1877F2] transition-opacity hover:opacity-80"
                      title="Chia sẻ lên Facebook"
                    >
                      <IconBrandFacebook className="size-4.5" />
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="flex items-center gap-1.5 font-semibold transition-colors"
                  >
                    {wishlisted ? (
                      <>
                        <IconHeartFilled className="animate-heart-pop size-4.5 text-rose-500" />
                        <span className="text-rose-500">
                          Đã lưu vào Yêu thích
                        </span>
                      </>
                    ) : (
                      <>
                        <IconHeart
                          className="size-4.5 text-slate-500 hover:text-rose-500"
                          strokeWidth={2}
                        />
                        <span>Thêm vào Yêu thích ({product.reviewsCount})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Product Buy Box */}
              <div className="flex flex-col space-y-6 lg:col-span-7 xl:col-span-8 2xl:col-span-8">
                {/* 1. Brand & Store Row */}
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-black text-white uppercase shadow-xs">
                    <IconShieldCheck className="size-3.5" />
                    ECOME MALL
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    Thương hiệu:{" "}
                    <strong className="text-foreground">{product.brand}</strong>
                  </span>
                </div>

                {/* 2. Title (Kích cỡ lớn, dễ đọc trên màn hình to) */}
                <h1 className="font-heading text-2xl leading-snug font-bold tracking-tight text-foreground sm:text-3xl">
                  {product.name}
                </h1>

                {/* 3. Ratings & Sales Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-amber-500 underline">
                      {product.rating.toFixed(1)}
                    </span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <IconStarFilled key={i} className="size-4" />
                      ))}
                    </div>
                  </div>
                  <span className="text-border">|</span>
                  <span className="text-muted-foreground">
                    <strong className="font-semibold text-foreground underline">
                      {product.reviewsCount.toLocaleString("vi-VN")}
                    </strong>{" "}
                    Đánh giá
                  </span>
                  <span className="text-border">|</span>
                  <span className="text-muted-foreground">
                    <strong className="font-semibold text-foreground">
                      {product.salesCount}
                    </strong>{" "}
                    Đã bán
                  </span>
                </div>

                {/* 4. Flash Deal Countdown Bar (nếu có) */}
                {product.isFlashDeal && (
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 px-4 py-2.5 text-white shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <IconBolt className="size-4 animate-bounce" />
                      <span>FLASH SALE KẾT THÚC TRONG</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs font-black">
                      <span className="rounded bg-black/40 px-1.5 py-0.5">
                        02
                      </span>
                      :
                      <span className="rounded bg-black/40 px-1.5 py-0.5">
                        59
                      </span>
                      :
                      <span className="rounded bg-black/40 px-1.5 py-0.5">
                        36
                      </span>
                    </div>
                  </div>
                )}

                {/* 5. Pricing Container */}
                <div className="rounded-xl bg-muted/40 p-5">
                  <div className="flex flex-wrap items-baseline gap-3.5">
                    <span className="font-sans text-3xl font-black text-emerald-600 tabular-nums sm:text-4xl dark:text-emerald-400">
                      {product.salePrice.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="font-sans text-base text-muted-foreground tabular-nums line-through sm:text-lg">
                      {product.originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>

                {/* 6. Vouchers Row */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-semibold text-muted-foreground">
                    Mã giảm giá Shop:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSaveVoucher("ECOME50K", "50.000₫")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-emerald-500/80 bg-emerald-500/10 px-3 py-1.5 text-xs sm:text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
                  >
                    <IconDiscount2 className="size-4" />
                    <span>Giảm 50.000₫</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveVoucher("FREESHIP", "Miễn phí vận chuyển")
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-blue-500/80 bg-blue-500/10 px-3 py-1.5 text-xs sm:text-sm font-bold text-blue-600 transition-colors hover:bg-blue-500/20 dark:text-blue-400"
                  >
                    <IconTruckDelivery className="size-4" />
                    <span>Freeship 0Đ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveVoucher("HOANXU10", "10% xu")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-amber-500/80 bg-amber-500/10 px-3 py-1.5 text-xs sm:text-sm font-bold text-amber-600 transition-colors hover:bg-amber-500/20 dark:text-amber-400"
                  >
                    <IconAward className="size-4" />
                    <span>Hoàn xu 10%</span>
                  </button>
                </div>

                {/* 7. Shipping & Delivery Address */}
                <div className="border-t border-border pt-5 text-sm">
                  <div className="flex items-start gap-3">
                    <IconTruckDelivery className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Vận chuyển đến:
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsDeliveryModalOpen(true)}
                          className="font-bold text-foreground underline transition-colors hover:text-primary"
                        >
                          {deliveryAddress.district}, {deliveryAddress.city}
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span>
                          Phí vận chuyển:{" "}
                          <strong className="text-emerald-600 dark:text-emerald-400">
                            0₫
                          </strong>{" "}
                          (Freeship Xtra)
                        </span>
                        <span>•</span>
                        <span>{product.deliveryEstimate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8. Variant Selection - KHÔNG THAY ĐỔI BORDER / KHÔNG TĂNG WIDTH, HOÀN TOÀN KHÔNG GIẬT LAYOUT */}
                <div className="space-y-3 border-t border-border pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <label className="font-bold text-foreground">
                      Chọn phiên bản màu:{" "}
                      <span className="font-semibold text-foreground">
                        {colorOptions[selectedColor]?.name}
                      </span>
                    </label>
                    <span className="text-xs text-muted-foreground">
                      Còn {colorOptions[selectedColor]?.stock || 25} sản phẩm
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {colorOptions.map((c, idx) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(idx)}
                        className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors cursor-pointer select-none ${
                          selectedColor === idx
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background text-foreground/80 hover:border-foreground/50 hover:text-foreground"
                        }`}
                      >
                        <span
                          className={`size-3.5 shrink-0 rounded-full border ${
                            selectedColor === idx
                              ? "border-white ring-2 ring-white/50"
                              : "border-black/10"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className={selectedColor === idx ? "text-white" : ""}>
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 9. Quantity Selector */}
                <div className="flex items-center gap-4 pt-1 text-sm">
                  <span className="font-bold text-foreground">Số lượng:</span>
                  <div className="flex items-center rounded-xl border border-border bg-background">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="flex size-9 items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30"
                    >
                      <IconMinus className="size-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-12 bg-transparent text-center text-sm font-bold tabular-nums focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="flex size-9 items-center justify-center text-muted-foreground hover:bg-muted"
                    >
                      <IconPlus className="size-4" />
                    </button>
                  </div>
                </div>

                {/* 10. CTA Buttons Strip: Secondary (Thêm vào giỏ) + Primary (Mua ngay), Solid Icons */}
                <div className="border-t border-border pt-6">
                  <div className="flex max-w-lg flex-wrap gap-3.5">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex h-12.5 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-5 text-sm font-bold text-secondary-foreground transition-all hover:bg-muted active:scale-98"
                    >
                      <IconShoppingCartFilled className="size-5 shrink-0" />
                      <span>Thêm vào giỏ</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex h-12.5 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-98"
                    >
                      <IconBoltFilled className="size-5 shrink-0" />
                      <span>
                        Mua ngay ({selectedVariantName.split(" ")[0]})
                      </span>
                    </button>
                  </div>
                </div>

                {/* 11. Guarantees Strip */}
                <div className="grid max-w-lg grid-cols-3 gap-3 border-t border-border pt-4 text-center text-xs text-muted-foreground sm:text-sm">
                  <div className="flex items-center justify-center gap-1.5">
                    <IconShieldCheck className="size-4.5 text-emerald-500" />
                    <span>100% Chính hãng</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <IconRotateClockwise2 className="size-4.5 text-emerald-500" />
                    <span>Đổi trả 30 ngày</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <IconTruckDelivery className="size-4.5 text-emerald-500" />
                    <span>Giao hỏa tốc 2H</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Official Store / Seller Prestige Card (ĐÁP ỨNG YÊU CẦU: Người bán uy tín ra sao) */}
          <div className="w-full rounded-2xl border border-slate-200/50 bg-card p-5 shadow-xs sm:p-6 dark:border-slate-800/60">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* Store Identity */}
              <div className="flex items-center gap-4">
                <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 text-white ring-2 ring-emerald-500/30">
                  <span className="font-heading text-2xl font-black text-emerald-400">
                    E
                  </span>
                  <span className="absolute right-1 bottom-1 size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-foreground sm:text-lg">
                      ECOME Official Flagship Store
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white uppercase shadow-xs">
                      <IconShieldCheck className="size-3" />
                      Mall Chính Hãng
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <IconCircleCheckFilled className="size-3.5" />
                      Đã xác thực giấy phép KD & Ủy quyền thương hiệu
                    </span>
                    <span>•</span>
                    <span>Online 5 phút trước</span>
                  </p>
                </div>
              </div>

              {/* Store Credibility Stats with clean separating borders */}
              <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-muted/20 text-xs sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
                <div className="p-3 sm:px-4 sm:py-2.5">
                  <span className="block text-[11px] text-muted-foreground">
                    Đánh giá uy tín
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-amber-500">
                    <IconStarFilled className="size-4 shrink-0" />
                    5.0 / 5.0 (142k)
                  </span>
                </div>
                <div className="p-3 sm:px-4 sm:py-2.5">
                  <span className="block text-[11px] text-muted-foreground">
                    Tỉ lệ phản hồi
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    <IconCircleCheckFilled className="size-4 shrink-0" />
                    100% (trong 5 phút)
                  </span>
                </div>
                <div className="p-3 sm:px-4 sm:py-2.5">
                  <span className="block text-[11px] text-muted-foreground">
                    Giao đúng hạn
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-foreground">
                    <IconTruckDelivery className="size-4 shrink-0 text-muted-foreground" />
                    99.8% thành công
                  </span>
                </div>
                <div className="p-3 sm:px-4 sm:py-2.5">
                  <span className="block text-[11px] text-muted-foreground">
                    Cam kết vàng
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-foreground">
                    <IconShieldCheckFilled className="size-4 shrink-0 text-amber-500" />
                    Hoàn tiền 200%
                  </span>
                </div>
              </div>

              {/* Action Buttons: SVG ICONS CHUẨN XÁC 100% */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    addToast({
                      title: "Kênh Chat CSKH 24/7",
                      message:
                        "Nhân viên tư vấn chính hãng ECOME đang kết nối...",
                      type: "info",
                    })
                  }
                  className="flex h-9.5 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 text-xs font-bold text-secondary-foreground transition-colors hover:bg-muted"
                >
                  <IconMessageFilled className="size-4 text-primary" />
                  <span>Chat ngay</span>
                </button>
                <Link
                  href="/"
                  className="flex h-9.5 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <IconBuildingStore className="size-4 text-slate-600 dark:text-slate-300" />
                  <span>Xem Shop</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 4. Unified Specifications & Detailed Description (KHÔNG CHIA TABS, LIỀN MẠCH THEO YÊU CẦU) */}
          <div className="w-full space-y-8 rounded-2xl border border-slate-200/40 bg-card p-6 shadow-xs sm:p-8 lg:p-10 dark:border-slate-800/60">
            {/* Section Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <span className="h-6 w-1.5 rounded-full bg-primary" />
              <h2 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
                CHI TIẾT SẢN PHẨM & THÔNG SỐ KỸ THUẬT
              </h2>
            </div>

            {/* Specifications Table */}
            <div>
              <h3 className="mb-3 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Bảng thông số kỹ thuật chuẩn hãng:
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="dark:bg-slate-850/40 bg-slate-50/60">
                      <td className="w-1/3 p-3.5 font-semibold text-muted-foreground">
                        Thương hiệu phân phối
                      </td>
                      <td className="p-3.5 font-bold text-foreground">
                        {product.brand} (Chính Hãng ECOME Mall)
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 p-3.5 font-semibold text-muted-foreground">
                        Danh mục thiết bị
                      </td>
                      <td className="p-3.5 font-medium text-foreground">
                        {product.category}
                      </td>
                    </tr>
                    {product.specs.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0
                            ? "dark:bg-slate-850/40 bg-slate-50/60"
                            : ""
                        }
                      >
                        <td className="w-1/3 p-3.5 font-semibold text-muted-foreground">
                          {item.label}
                        </td>
                        <td className="p-3.5 font-medium text-foreground">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                    <tr className="dark:bg-slate-850/40 bg-slate-50/60">
                      <td className="w-1/3 p-3.5 font-semibold text-muted-foreground">
                        Chế độ bảo hành
                      </td>
                      <td className="p-3.5 font-medium text-emerald-600 dark:text-emerald-400">
                        12 tháng chính hãng • 1 đổi 1 trong 30 ngày tận nơi
                      </td>
                    </tr>
                    <tr>
                      <td className="w-1/3 p-3.5 font-semibold text-muted-foreground">
                        Hình thức vận chuyển
                      </td>
                      <td className="p-3.5 font-medium text-foreground">
                        Giao hỏa tốc 2 giờ nội thành • Freeship toàn quốc
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* In-depth Product Description */}
            <div className="space-y-4 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-700 sm:text-sm dark:border-slate-800 dark:text-slate-300">
              <h3 className="font-heading text-base font-bold text-foreground">
                Mô tả chi tiết và trải nghiệm thực tế:
              </h3>
              <p>{product.description}</p>
              <div className="space-y-2.5 rounded-xl bg-slate-50 p-4 sm:p-5 dark:bg-slate-800/40">
                <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
                  Tại sao bạn nên chọn mua tại ECOME Mall:
                </h4>
                <ul className="list-disc space-y-1.5 pl-5 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                  <li>
                    Cam kết 100% hàng chính hãng mới nguyên seal, bồi thường gấp
                    đôi nếu phát hiện hàng không chuẩn.
                  </li>
                  <li>
                    Bảo hành điện tử tự động kích hoạt ngay sau khi đơn hàng
                    giao thành công.
                  </li>
                  <li>
                    Hỗ trợ kỹ thuật 24/7 và kiểm tra sản phẩm trước khi thanh
                    toán tiền (COD).
                  </li>
                  <li>
                    Đổi trả miễn phí trong 30 ngày nếu có bất kỳ lỗi nào từ nhà
                    sản xuất.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 5. Customer Reviews & Comments with Media & Likes (CUỘN TRANG LIÊN TỤC THEO YÊU CẦU) */}
          <div className="w-full space-y-6 rounded-2xl border border-slate-200/40 bg-card p-6 shadow-xs sm:p-8 lg:p-10 dark:border-slate-800/60">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="h-6 w-1.5 rounded-full bg-amber-500" />
                <h2 className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  ĐÁNH GIÁ & BÌNH LUẬN TỪ NGƯỜI MUA (
                  {product.reviewsCount.toLocaleString("vi-VN")})
                </h2>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Tất cả đánh giá từ người mua thực tế đã nhận hàng
              </span>
            </div>

            {/* Score Breakdown Summary Dashboard (FLAT, HIỆN ĐẠI, BẢNG TỈ LỆ SAO RÕ RÀNG) */}
            <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-muted/20 p-6 sm:p-7 md:grid-cols-12 md:items-center">
              {/* Cột 1: Điểm tổng quát */}
              <div className="text-center md:col-span-3 md:text-left">
                <div className="flex items-baseline justify-center gap-1.5 md:justify-start">
                  <span className="font-heading text-4xl font-black text-amber-500 tabular-nums sm:text-5xl">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-lg font-bold text-muted-foreground">/ 5</span>
                </div>
                <div className="mt-2 flex justify-center text-amber-500 md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <IconStarFilled key={i} className="size-4.5" />
                  ))}
                </div>
                <p className="mt-2 text-xs font-semibold text-muted-foreground">
                  Dựa trên {product.reviewsCount.toLocaleString("vi-VN")} lượt đánh giá
                </p>
                <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <IconCircleCheckFilled className="size-3" />
                  <span>98% hài lòng tuyệt đối</span>
                </div>
              </div>

              {/* Cột 2: Bảng phân bổ số sao (Progress Bars) */}
              <div className="space-y-2 border-y border-border py-4 md:col-span-5 md:border-y-0 md:border-x md:px-8 md:py-0">
                {[
                  { star: 5, percent: 96, count: "3.955" },
                  { star: 4, percent: 3, count: "120" },
                  { star: 3, percent: 1, count: "35" },
                  { star: 2, percent: 0, count: "6" },
                  { star: 1, percent: 0, count: "4" },
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-2.5 text-xs">
                    <span className="flex w-11 items-center gap-0.5 font-bold text-foreground">
                      <span>{item.star}</span>
                      <IconStarFilled className="size-3 text-amber-500" />
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                    <span className="w-9 text-right font-mono text-[11px] text-muted-foreground">
                      {item.percent}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Cột 3: Bộ lọc đánh giá trực quan (Clean Flat Pills) */}
              <div className="flex flex-col gap-2.5 md:col-span-4 md:pl-2">
                <span className="text-xs font-bold text-muted-foreground">
                  Lọc xem theo tiêu chí:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setReviewFilter("all")}
                    className={cn(
                      "rounded-xl border px-3.5 py-1.5 font-bold transition-colors cursor-pointer",
                      reviewFilter === "all"
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    )}
                  >
                    Tất cả ({product.reviewsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter("5star")}
                    className={cn(
                      "rounded-xl border px-3.5 py-1.5 font-bold transition-colors cursor-pointer",
                      reviewFilter === "5star"
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    )}
                  >
                    5 Sao (96%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFilter("hasMedia")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-bold transition-colors cursor-pointer",
                      reviewFilter === "hasMedia"
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    )}
                  >
                    <IconPhoto className="size-3.5" />
                    <span>Có ảnh & Video (840)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Real Customer Comments with Photos & Interactive Likes */}
            <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
              {/* Review 1 */}
              <div className="space-y-3 pt-6 first:pt-0">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      HM
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        Hoàng Minh Quân
                      </p>
                      <p className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                        <IconCircleCheckFilled className="size-3" />
                        Đã mua hàng tại ECOME Mall
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Hôm qua lúc 14:20
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <IconStarFilled key={i} className="size-3.5" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Phân loại hàng: <strong>{selectedVariantName}</strong>
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-slate-700 sm:text-sm dark:text-slate-300">
                  Giao hàng siêu nhanh chỉ trong 2 tiếng là shipper đã mang tới
                  nhà. Hàng chuẩn nguyên seal nhà sản xuất, âm thanh và độ hoàn
                  thiện tuyệt hảo. Rất đáng đồng tiền bát gạo!
                </p>

                {/* Customer Media Attachments */}
                <div className="flex items-center gap-2.5 pt-1">
                  <img
                    src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&q=80&auto=format&fit=crop"
                    alt="Ảnh chụp thực tế từ khách hàng 1"
                    className="size-20 cursor-pointer rounded-xl object-cover ring-1 ring-black/5 transition-transform hover:scale-105"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80&auto=format&fit=crop"
                    alt="Ảnh chụp thực tế từ khách hàng 2"
                    className="size-20 cursor-pointer rounded-xl object-cover ring-1 ring-black/5 transition-transform hover:scale-105"
                  />
                </div>

                {/* Helpful Like Button */}
                <div className="flex items-center gap-4 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleLikeReview("rev1")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                      likedReviews["rev1"]
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
                        : "dark:hover:bg-slate-850 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <IconThumbUp className="size-3.5" />
                    <span>Hữu ích ({reviewLikes["rev1"]})</span>
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Báo cáo đánh giá
                  </span>
                </div>
              </div>

              {/* Review 2 */}
              <div className="space-y-3 pt-6">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      TL
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        Trần Thị Bích Loan
                      </p>
                      <p className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                        <IconCircleCheckFilled className="size-3" />
                        Đã mua hàng tại ECOME Mall
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    3 ngày trước
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <IconStarFilled key={i} className="size-3.5" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Phân loại hàng:{" "}
                    <strong>{colorOptions[1]?.name || "Bạc Ánh Kim"}</strong>
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-slate-700 sm:text-sm dark:text-slate-300">
                  Shop đóng gói rất kỹ, có 3 lớp mút chống sốc bảo vệ góc cạnh.
                  Màu sắc thực tế nhìn sang trọng hơn trong ảnh, bảo hành điện
                  tử chính hãng kích hoạt chuẩn chỉ. Sẽ ủng hộ tiếp!
                </p>

                {/* Customer Media Attachments */}
                <div className="flex items-center gap-2.5 pt-1">
                  <img
                    src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80&auto=format&fit=crop"
                    alt="Ảnh chụp thực tế từ khách hàng 3"
                    className="size-20 cursor-pointer rounded-xl object-cover ring-1 ring-black/5 transition-transform hover:scale-105"
                  />
                </div>

                {/* Helpful Like Button */}
                <div className="flex items-center gap-4 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleLikeReview("rev2")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                      likedReviews["rev2"]
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
                        : "dark:hover:bg-slate-850 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <IconThumbUp className="size-3.5" />
                    <span>Hữu ích ({reviewLikes["rev2"]})</span>
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Báo cáo đánh giá
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Related Products Section */}
          <div className="w-full space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-6 w-1.5 rounded-full bg-primary" />
                <h3 className="font-heading text-lg font-black tracking-tight text-foreground sm:text-xl">
                  SẢN PHẨM TƯƠNG TỰ CÓ THỂ BẠN THÍCH
                </h3>
              </div>
              <Link
                href="/"
                className="text-xs font-bold text-primary hover:underline"
              >
                Xem thêm sản phẩm →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isFlashDeal={Boolean(p.isFlashDeal)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function ProductDetailPage() {
  return <ProductDetailContent />
}
