"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStore } from "@/context/store-context"
import { PRODUCTS, type Product } from "@/lib/data"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import {
  IconBuildingBank,
  IconCopy,
  IconCheck,
  IconCircleCheckFilled,
  IconTruckDelivery,
  IconClock,
  IconShieldCheckFilled,
  IconAlertCircle,
  IconLockFilled,
  IconMapPin,
  IconArrowLeft,
  IconTicket,
  IconQrcode,
  IconLoader2,
  IconBuildingStore,
  IconShoppingCartOff,
  IconArrowRight,
} from "@tabler/icons-react"

function CheckoutContent() {
  const router = useRouter()
  const {
    checkoutProduct,
    cart,
    clearCart,
    deliveryAddress,
    setDeliveryAddress,
    addToast,
  } = useStore()

  // Determine items to checkout: either checkoutProduct or cart items (no fake fallbacks when cart is empty)
  const orderItems = useMemo(() => {
    if (checkoutProduct) {
      return [{ product: checkoutProduct, quantity: 1 }]
    }
    return cart
  }, [checkoutProduct, cart])

  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "cod">("vietqr")
  const [shippingMethod, setShippingMethod] = useState<
    "express" | "standard" | "saver"
  >("express")
  const [orderNote, setOrderNote] = useState("")
  const [voucherCode, setVoucherCode] = useState("")

  // Available vouchers in wallet
  const AVAILABLE_VOUCHERS = useMemo(
    () => [
      {
        code: "ECOMEFAST",
        title: "Giảm 50.000₫ đơn bất kỳ",
        discount: 50000,
        type: "product" as const,
        tag: "HOT DEAL",
      },
      {
        code: "FREESHIP",
        title: "Freeship vận chuyển tối đa 30.000₫",
        discount: 30000,
        type: "shipping" as const,
        tag: "FREESHIP",
      },
      {
        code: "VIP100K",
        title: "Giảm 100.000₫ VIP Kim Cương",
        discount: 100000,
        type: "product" as const,
        tag: "VIP ONLY",
      },
    ],
    []
  )

  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string
    title: string
    discount: number
    type: "product" | "shipping"
  } | null>({
    code: "ECOMEFAST",
    title: "Giảm 50.000₫ đơn bất kỳ",
    discount: 50000,
    type: "product",
  })

  // Shipping Options
  const SHIPPING_OPTIONS = useMemo(
    () => [
      {
        id: "express" as const,
        name: "Giao Hỏa Tốc 2H (ECOME Now)",
        price: 30000,
        estimate: "Giao trong 2 giờ • Trước 18:00 hôm nay",
        badge: "HỎA TỐC 2H",
        desc: "Đội ngũ shipper hỏa tốc chuyên trách • Cam kết đúng hẹn",
      },
      {
        id: "standard" as const,
        name: "Giao Nhanh Tiêu Chuẩn (1 - 2 ngày)",
        price: 15000,
        estimate: "Giao ngày mai",
        badge: "TIÊU CHUẨN",
        desc: "Vận chuyển bưu phẩm an toàn qua SPX / ViettelPost",
      },
      {
        id: "saver" as const,
        name: "Tiết Kiệm (Freeship Toàn Quốc)",
        price: 0,
        estimate: "2 - 3 ngày làm việc",
        badge: "MIỄN PHÍ 0Đ",
        desc: "Miễn phí vận chuyển tiêu chuẩn cho mọi đơn hàng",
      },
    ],
    []
  )

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 phút đếm ngược

  // Fixed Banking Information provided by User
  const BANK_INFO = {
    bankName: "MB Bank (Ngân hàng TMCP Quân Đội)",
    bankCode: "MB",
    accountNo: "0335574737",
    accountName: "NGUYEN HOANG NAM",
  }

  // Generate unique stable order ID
  const orderId = useMemo(() => {
    return `ECM${Math.floor(100000 + Math.random() * 900000)}`
  }, [])

  // Editable recipient info
  const [recipient, setRecipient] = useState({
    name: "Nguyễn Văn An",
    phone: "0918 888 999",
    city: deliveryAddress.city || "Hồ Chí Minh",
    district: deliveryAddress.district || "Quận 1, Phường Bến Nghé",
    address: deliveryAddress.address || "Số 68 Nguyễn Huệ",
  })
  const [isEditingAddress, setIsEditingAddress] = useState(false)

  // Subtotal and financial calculation
  const subtotal = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + item.product.salePrice * item.quantity,
      0
    )
  }, [orderItems])

  const selectedShipping = useMemo(() => {
    return (
      SHIPPING_OPTIONS.find((s) => s.id === shippingMethod) ||
      SHIPPING_OPTIONS[0]!
    )
  }, [shippingMethod, SHIPPING_OPTIONS])

  const shippingFee = selectedShipping.price

  const shippingDiscount = useMemo(() => {
    if (
      appliedVoucher?.type === "shipping" ||
      appliedVoucher?.code === "FREESHIP"
    ) {
      return Math.min(shippingFee, appliedVoucher.discount)
    }
    return 0
  }, [appliedVoucher, shippingFee])

  const productDiscount = useMemo(() => {
    if (
      appliedVoucher &&
      appliedVoucher.type !== "shipping" &&
      appliedVoucher.code !== "FREESHIP"
    ) {
      return appliedVoucher.discount
    }
    return 0
  }, [appliedVoucher])

  const finalShippingFee = Math.max(0, shippingFee - shippingDiscount)
  const finalTotal = Math.max(0, subtotal + finalShippingFee - productDiscount)

  // Real VietQR clean qr_only API with dynamic total & memo
  const vietQrUrl = useMemo(() => {
    return `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNo}-qr_only.png?amount=${finalTotal}&addInfo=${encodeURIComponent(orderId)}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`
  }, [finalTotal, orderId])

  // Timer countdown
  useEffect(() => {
    if (isSuccess) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [isSuccess])

  const formattedTimeLeft = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }, [timeLeft])

  const handleCopy = (text: string, fieldName: string, label: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedField(fieldName)
    addToast({
      title: "Đã sao chép!",
      message: `${label}: ${text}`,
      type: "success",
    })
    setTimeout(() => {
      setCopiedField((cur) => (cur === fieldName ? null : cur))
    }, 2000)
  }

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    const code = voucherCode.trim().toUpperCase()
    const found = AVAILABLE_VOUCHERS.find((v) => v.code === code)
    if (found) {
      setAppliedVoucher(found)
      addToast({
        title: `Áp dụng thành công mã ${found.code}!`,
        message: found.title,
        type: "success",
      })
      setVoucherCode("")
    } else if (code.length > 0) {
      addToast({
        title: "Mã giảm giá không hợp lệ",
        message: "Bạn có thể chọn nhanh các voucher có sẵn bên dưới!",
        type: "info",
      })
    }
  }

  const handleCompleteOrder = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      clearCart()
      addToast({
        title:
          paymentMethod === "vietqr"
            ? "Thanh toán VietQR thành công!"
            : "Đặt hàng COD thành công!",
        message: `Mã đơn hàng: #${orderId}`,
        type: "success",
      })
    }, 1200)
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Checkout Minimal Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <IconArrowLeft className="size-4" />
                <span>Tiếp tục mua sắm</span>
              </Link>
              <span className="text-border">|</span>
              <Link href="/" className="flex items-center gap-2">
                <span className="font-heading text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  ECOME<span className="text-primary">.</span>
                </span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  Thanh toán an toàn
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <IconShieldCheckFilled className="size-4" />
              <span className="hidden sm:inline">Bảo mật giao dịch 256-bit SSL</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {isSuccess ? (
          /* Full Page Order Success Celebration */
          <div className="mx-auto max-w-2xl py-8 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <IconCircleCheckFilled className="size-14 animate-bounce" />
            </div>

            <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {paymentMethod === "vietqr"
                ? "Thanh toán VietQR thành công!"
                : "Đặt hàng ECOME thành công!"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Đơn hàng của bạn đã được chuyển đến bộ phận kho và đang đóng gói hỏa tốc.
            </p>

            {/* Receipt Card */}
            <div className="mt-8 space-y-3 rounded-2xl border border-border bg-card p-6 text-left shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm font-semibold text-muted-foreground">
                  Mã đơn hàng:
                </span>
                <span className="font-mono text-base font-black text-foreground">
                  #{orderId}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 text-sm">
                <span className="text-muted-foreground">Phương thức thanh toán:</span>
                <span className="font-bold text-foreground">
                  {paymentMethod === "vietqr"
                    ? "MB Bank VietQR 24/7 (Đã thanh toán)"
                    : "COD (Thanh toán khi nhận hàng)"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 text-sm">
                <span className="text-muted-foreground">Người nhận:</span>
                <span className="font-semibold text-foreground">
                  {recipient.name} • {recipient.phone}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 text-sm">
                <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
                <span className="max-w-xs text-right font-semibold text-foreground sm:max-w-md">
                  {recipient.address}, {recipient.district}, {recipient.city}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="font-bold text-foreground">Tổng thanh toán:</span>
                <span className="font-sans text-xl font-black text-primary tabular-nums">
                  {finalTotal.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Dự kiến giao hàng: Hôm nay trước 18:00 (Freeship Toàn Quốc 0₫)
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="default"
                onClick={() => router.push("/")}
                className="h-11 px-8 font-bold shadow-none"
              >
                Về trang chủ ECOME
              </Button>
            </div>
          </div>
        ) : orderItems.length === 0 ? (
          /* Empty Cart State */
          <div className="mx-auto max-w-lg py-16 text-center">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <IconShoppingCartOff className="size-10" />
            </div>
            <h2 className="mt-5 font-heading text-xl font-bold text-foreground sm:text-2xl">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Bạn chưa có sản phẩm nào trong đơn hàng để tiến hành thanh toán. Hãy chọn những sản phẩm ưng ý vào giỏ hàng trước nhé!
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-heading text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-98"
              >
                <span>Khám phá sản phẩm ngay</span>
                <IconArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Active Checkout Workflow: 2-Column Responsive Fluid Layout */
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
            {/* LEFT COLUMN: Shipping & Order Review Details (7 Cols) */}
            <div className="space-y-6 lg:col-span-7 xl:col-span-7">
              {/* 1. Recipient Information */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <div className="flex items-center gap-2">
                    <IconMapPin className="size-5 text-primary" />
                    <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                      1. Thông tin giao hàng
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress((v) => !v)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    {isEditingAddress ? "Hoàn tất" : "Thay đổi thông tin"}
                  </button>
                </div>

                {isEditingAddress ? (
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-semibold text-muted-foreground">
                          Họ và tên người nhận:
                        </label>
                        <input
                          type="text"
                          value={recipient.name}
                          onChange={(e) =>
                            setRecipient({ ...recipient, name: e.target.value })
                          }
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-muted-foreground">
                          Số điện thoại:
                        </label>
                        <input
                          type="text"
                          value={recipient.phone}
                          onChange={(e) =>
                            setRecipient({ ...recipient, phone: e.target.value })
                          }
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block font-semibold text-muted-foreground">
                        Địa chỉ cụ thể (Số nhà, tên đường, phường):
                      </label>
                      <input
                        type="text"
                        value={recipient.address}
                        onChange={(e) =>
                          setRecipient({ ...recipient, address: e.target.value })
                        }
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-1 text-sm text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{recipient.name}</span>
                      <span className="text-border">•</span>
                      <span className="font-semibold text-muted-foreground">
                        {recipient.phone}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {recipient.address}, {recipient.district}, {recipient.city}
                    </p>
                  </div>
                )}

                {/* Order Note */}
                <div className="mt-4 border-t border-border pt-3">
                  <input
                    type="text"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Ghi chú đơn hàng cho nhân viên giao hàng (tuỳ chọn)..."
                    className="w-full rounded-xl border border-input bg-muted/20 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Shipping Method Selector */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <div className="flex items-center gap-2">
                    <IconTruckDelivery className="size-5 text-primary" />
                    <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                      2. Chọn hình thức vận chuyển
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Bảo hiểm bưu phẩm 100%
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {SHIPPING_OPTIONS.map((option) => {
                    const isSelected = shippingMethod === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setShippingMethod(option.id)}
                        className={cn(
                          "w-full flex items-center justify-between rounded-xl border-2 p-3.5 sm:p-4 text-left transition-colors cursor-pointer select-none",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border-2",
                              isSelected
                                ? "border-white bg-white text-primary"
                                : "border-muted-foreground/40 bg-transparent"
                            )}
                          >
                            {isSelected && (
                              <span className="size-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={cn(
                                  "font-heading text-sm font-bold",
                                  isSelected ? "text-white" : "text-foreground"
                                )}
                              >
                                {option.name}
                              </span>
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.5 text-[10px] font-black uppercase",
                                  isSelected
                                    ? "bg-white/20 text-white"
                                    : option.id === "express"
                                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                      : option.id === "saver"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                )}
                              >
                                {option.badge}
                              </span>
                            </div>
                            <p
                              className={cn(
                                "mt-0.5 text-xs",
                                isSelected ? "text-white/85" : "text-muted-foreground"
                              )}
                            >
                              {option.desc}
                            </p>
                            <span
                              className={cn(
                                "mt-1 inline-flex items-center gap-1 font-mono text-[11px] font-semibold",
                                isSelected
                                  ? "text-white/95"
                                  : "text-emerald-600 dark:text-emerald-400"
                              )}
                            >
                              <IconClock className="size-3" />
                              {option.estimate}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 pl-3">
                          <span
                            className={cn(
                              "font-sans text-sm font-black tabular-nums sm:text-base",
                              isSelected ? "text-white" : "text-foreground"
                            )}
                          >
                            {option.price === 0
                              ? "0₫ (Freeship)"
                              : `${option.price.toLocaleString("vi-VN")}₫`}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 3. Payment Method Selector */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border pb-3.5">
                  <IconBuildingBank className="size-5 text-primary" />
                  <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                    3. Chọn phương thức thanh toán
                  </h2>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* VietQR MB Bank Button */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("vietqr")}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors cursor-pointer select-none",
                      paymentMethod === "vietqr"
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                    )}
                  >
                    <IconQrcode
                      className={cn(
                        "size-6 shrink-0 mt-0.5",
                        paymentMethod === "vietqr" ? "text-white" : "text-primary"
                      )}
                    />
                    <div>
                      <span
                        className={cn(
                          "block text-sm font-bold",
                          paymentMethod === "vietqr" ? "text-white" : "text-foreground"
                        )}
                      >
                        Chuyển khoản VietQR MB Bank
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-xs font-semibold",
                          paymentMethod === "vietqr"
                            ? "text-white/90"
                            : "text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        Quét mã QR 24/7 • Xử lý tự động tức thì
                      </span>
                    </div>
                  </button>

                  {/* COD Button */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors cursor-pointer select-none",
                      paymentMethod === "cod"
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                    )}
                  >
                    <IconTruckDelivery
                      className={cn(
                        "size-6 shrink-0 mt-0.5",
                        paymentMethod === "cod" ? "text-white" : "text-muted-foreground"
                      )}
                    />
                    <div>
                      <span
                        className={cn(
                          "block text-sm font-bold",
                          paymentMethod === "cod" ? "text-white" : "text-foreground"
                        )}
                      >
                        Thanh toán khi nhận hàng (COD)
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-xs",
                          paymentMethod === "cod" ? "text-white/85" : "text-muted-foreground"
                        )}
                      >
                        Kiểm hàng nguyên seal mới trả tiền
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 4. Items Ordered List */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                    4. Sản phẩm trong đơn hàng ({orderItems.length})
                  </h2>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Được bảo hiểm chính hãng 100%
                  </span>
                </div>

                <div className="mt-4 divide-y divide-border">
                  {orderItems.map((item, idx) => (
                    <div
                      key={item.product.id + idx}
                      className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="size-16 shrink-0 rounded-xl border border-border object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase">
                          {item.product.brand}
                        </span>
                        <h4 className="truncate font-heading text-sm font-bold text-foreground">
                          {item.product.name}
                        </h4>
                        {item.selectedVariant && (
                          <div className="mt-0.5">
                            <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {item.selectedVariant}
                            </span>
                          </div>
                        )}
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            Số lượng:{" "}
                            <strong className="text-foreground">
                              {item.quantity}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>
                            Đơn giá:{" "}
                            {item.product.salePrice.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-sans text-sm font-black text-foreground tabular-nums sm:text-base">
                          {(
                            item.product.salePrice * item.quantity
                          ).toLocaleString("vi-VN")}
                          ₫
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Voucher Code & Available Vouchers */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3.5">
                  <div className="flex items-center gap-2">
                    <IconTicket className="size-5 text-primary" />
                    <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                      5. ECOME Voucher & Mã giảm giá
                    </h2>
                  </div>
                  {appliedVoucher && (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedVoucher(null)
                        addToast({
                          title: "Đã hủy mã voucher",
                          type: "info",
                        })
                      }}
                      className="text-xs font-semibold text-rose-500 hover:underline"
                    >
                      Bỏ áp dụng
                    </button>
                  )}
                </div>

                {/* Available Voucher Chips */}
                <div className="mt-4">
                  <span className="mb-2 block text-xs font-bold text-muted-foreground">
                    Kho voucher khả dụng của bạn (Click để áp dụng):
                  </span>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {AVAILABLE_VOUCHERS.map((v) => {
                      const isApplied = appliedVoucher?.code === v.code
                      return (
                        <button
                          key={v.code}
                          type="button"
                          onClick={() => {
                            if (isApplied) {
                              setAppliedVoucher(null)
                              addToast({
                                title: `Đã hủy mã ${v.code}`,
                                type: "info",
                              })
                            } else {
                              setAppliedVoucher(v)
                              addToast({
                                title: `Đã áp dụng mã ${v.code}!`,
                                message: v.title,
                                type: "success",
                              })
                            }
                          }}
                          className={cn(
                            "flex flex-col justify-between rounded-xl border-2 p-3 text-left transition-all cursor-pointer select-none",
                            isApplied
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                          )}
                        >
                          <div>
                            <div className="mb-1 flex items-center justify-between gap-1">
                              <span
                                className={cn(
                                  "font-mono text-xs font-black",
                                  isApplied ? "text-white" : "text-foreground"
                                )}
                              >
                                {v.code}
                              </span>
                              <span
                                className={cn(
                                  "rounded px-1.5 py-0.5 text-[9px] font-black uppercase",
                                  isApplied
                                    ? "bg-white/20 text-white font-black"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {isApplied ? "ĐANG DÙNG" : v.tag}
                              </span>
                            </div>
                            <p
                              className={cn(
                                "text-[11px] leading-tight font-semibold",
                                isApplied ? "text-white" : "text-foreground"
                              )}
                            >
                              {v.title}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "mt-2 text-[10px] font-medium",
                              isApplied ? "text-white/85" : "text-muted-foreground"
                            )}
                          >
                            {isApplied ? "Click để gỡ bỏ" : "Click áp dụng"}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Custom Voucher Input Form */}
                <div className="mt-4 border-t border-border pt-4">
                  <span className="mb-2 block text-xs font-bold text-muted-foreground">
                    Hoặc nhập mã voucher khác:
                  </span>
                  <form onSubmit={handleApplyVoucher} className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Nhập mã voucher (ví dụ: ECOMEFAST, FREESHIP)..."
                      className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 font-mono text-xs uppercase tracking-wider placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      className="h-10 px-5 text-xs font-bold"
                    >
                      Áp dụng
                    </Button>
                  </form>
                  {appliedVoucher && (
                    <p className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <IconCircleCheckFilled className="size-4" />
                      <span>
                        Đang áp dụng: <strong>{appliedVoucher.code}</strong> —{" "}
                        {appliedVoucher.title} (-
                        {appliedVoucher.discount.toLocaleString("vi-VN")}₫)
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Real VietQR Panel & Financial Summary (5 Cols) */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5 xl:col-span-5">
              {/* Payment Box */}
              {paymentMethod === "vietqr" ? (
                /* FLAT, LARGE, CLEAN VIETQR CARD (THEO YÊU CẦU: Flat + To ra dễ quét + Bỏ rác) */
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b border-border pb-3.5">
                    <div className="flex items-center gap-2">
                      <IconBuildingBank className="size-5 text-primary" />
                      <h3 className="font-heading text-base font-bold text-foreground">
                        Mã QR Chuyển khoản MB Bank
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      <IconClock className="size-3.5" />
                      <span>{formattedTimeLeft}</span>
                    </div>
                  </div>

                  {/* Clean Big Flat QR Code */}
                  <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-white p-5 text-slate-950 shadow-xs">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Mã QR Chuyển khoản MB Bank"
                      className="size-64 rounded-lg object-contain sm:size-72"
                    />
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-800">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Quét bằng bất kỳ App Ngân hàng hoặc Ví điện tử</span>
                    </div>
                  </div>

                  {/* Flat Clean Banking Info Table */}
                  <div className="mt-5 divide-y divide-border rounded-xl border border-border bg-muted/20 text-xs">
                    <div className="flex items-center justify-between p-3">
                      <span className="text-muted-foreground">Ngân hàng thụ hưởng:</span>
                      <span className="font-bold text-foreground">
                        {BANK_INFO.bankName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3">
                      <div>
                        <span className="text-muted-foreground">Số tài khoản:</span>
                        <p className="font-mono text-sm font-black text-foreground tracking-wide">
                          {BANK_INFO.accountNo}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(BANK_INFO.accountNo, "stk", "Số tài khoản")
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 font-semibold text-foreground hover:bg-muted"
                      >
                        {copiedField === "stk" ? (
                          <>
                            <IconCheck className="size-3 text-emerald-500" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <IconCopy className="size-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3">
                      <span className="text-muted-foreground">Tên người thụ hưởng:</span>
                      <span className="font-bold text-foreground uppercase tracking-wider">
                        {BANK_INFO.accountName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3">
                      <div>
                        <span className="text-muted-foreground">Số tiền:</span>
                        <p className="font-sans text-sm font-black text-primary tabular-nums">
                          {finalTotal.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(finalTotal.toString(), "amount", "Số tiền")
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 font-semibold text-foreground hover:bg-muted"
                      >
                        {copiedField === "amount" ? (
                          <>
                            <IconCheck className="size-3 text-emerald-500" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <IconCopy className="size-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-500/5">
                      <div>
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                          Nội dung chuyển khoản (bắt buộc):
                        </span>
                        <p className="font-mono text-sm font-black text-foreground tracking-wide">
                          {orderId}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(orderId, "memo", "Nội dung chuyển khoản")
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-100 px-2.5 py-1 font-bold text-amber-900 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                      >
                        {copiedField === "memo" ? (
                          <>
                            <IconCheck className="size-3 text-emerald-600" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <IconCopy className="size-3" />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <IconAlertCircle className="size-3.5 shrink-0 mt-0.5 text-amber-500" />
                    <span>
                      Hệ thống tự động kích hoạt đơn hàng sau 10 giây khi nhận được đúng nội dung <strong>{orderId}</strong>.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleCompleteOrder}
                    disabled={isSubmitting}
                    className="mt-5 h-12 w-full text-sm font-bold shadow-none"
                  >
                    {isSubmitting ? (
                      <>
                        <IconLoader2 className="size-4 animate-spin" />
                        <span>Đang kiểm tra giao dịch từ MB Bank...</span>
                      </>
                    ) : (
                      <>
                        <IconCircleCheckFilled className="size-4.5" />
                        <span>Tôi đã chuyển khoản thành công</span>
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                /* COD Card */
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                  <h3 className="font-heading text-base font-bold text-foreground">
                    Thanh toán khi nhận hàng (COD)
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Bạn sẽ thanh toán tiền mặt trực tiếp cho nhân viên giao hàng sau khi nhận và kiểm tra bưu phẩm.
                  </p>

                  <Button
                    type="button"
                    variant="default"
                    onClick={handleCompleteOrder}
                    disabled={isSubmitting}
                    className="mt-5 h-12 w-full text-sm font-bold shadow-none"
                  >
                    {isSubmitting ? (
                      <>
                        <IconLoader2 className="size-4 animate-spin" />
                        <span>Đang tạo đơn hàng COD...</span>
                      </>
                    ) : (
                      <>
                        <IconCircleCheckFilled className="size-4.5" />
                        <span>Xác nhận đặt hàng COD ngay</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Order Calculation Summary Card */}
              <div className="rounded-2xl border border-border bg-card p-5 text-xs shadow-xs">
                <div className="space-y-2.5 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Tạm tính tiền hàng ({orderItems.length} sản phẩm):</span>
                    <span className="font-sans font-semibold text-foreground tabular-nums">
                      {subtotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Phí vận chuyển ({selectedShipping.name}):</span>
                    <span className="font-sans font-semibold text-foreground tabular-nums">
                      {shippingFee === 0
                        ? "0₫ (Miễn phí)"
                        : `${shippingFee.toLocaleString("vi-VN")}₫`}
                    </span>
                  </div>

                  {shippingDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Giảm giá phí vận chuyển ({appliedVoucher?.code}):</span>
                      <span className="font-sans tabular-nums">
                        -{shippingDiscount.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}

                  {productDiscount > 0 && (
                    <div className="flex justify-between text-rose-500 font-semibold">
                      <span>Giảm giá Voucher ({appliedVoucher?.code}):</span>
                      <span className="font-sans tabular-nums">
                        -{productDiscount.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-border pt-3 text-sm font-bold text-foreground">
                    <span>Tổng tiền thanh toán:</span>
                    <span className="font-sans text-xl font-black text-primary tabular-nums">
                      {finalTotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
