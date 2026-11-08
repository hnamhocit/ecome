"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useStore } from "@/context/store-context"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import {
  IconBoltFilled,
  IconCircleCheckFilled,
  IconCopy,
  IconCheck,
  IconQrcode,
  IconBuildingBank,
  IconTruckDelivery,
  IconClock,
  IconShieldCheckFilled,
  IconRefresh,
  IconMapPin,
  IconX,
  IconLoader2,
  IconAlertCircle,
} from "@tabler/icons-react"

export function CheckoutModal() {
  const {
    checkoutProduct,
    setCheckoutProduct,
    deliveryAddress,
    setIsDeliveryModalOpen,
    addToast,
  } = useStore()

  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "cod">("vietqr")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(900) // 15:00 minutes countdown

  // Fixed Banking Information provided by User
  const BANK_INFO = {
    bankName: "MB Bank (Ngân hàng TMCP Quân Đội)",
    bankCode: "MB",
    accountNo: "0335574737",
    accountName: "NGUYEN HOANG NAM",
  }

  // Generate unique Order Code once per checkout session
  const orderId = useMemo(() => {
    return `ECM${Math.floor(100000 + Math.random() * 900000)}`
  }, [checkoutProduct?.id])

  // Countdown timer for VietQR session
  useEffect(() => {
    if (!checkoutProduct || isSuccess) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [checkoutProduct, isSuccess])

  const formattedTimeLeft = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }, [timeLeft])

  // Prevent background scroll when modal open
  useEffect(() => {
    if (checkoutProduct) {
      setIsSuccess(false)
      setIsClosing(false)
      setTimeLeft(900)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [checkoutProduct])

  if (!checkoutProduct) return null

  const orderTotal = checkoutProduct.salePrice

  // Live VietQR API Image URL (QuickLink Standard)
  const vietQrUrl = `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNo}-compact2.png?amount=${orderTotal}&addInfo=${encodeURIComponent(orderId)}&accountName=${encodeURIComponent(BANK_INFO.accountName)}`

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

  const handleConfirmOrder = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
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

  const handleClose = () => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      setCheckoutProduct(null)
      setIsClosing(false)
      setIsSuccess(false)
    }, 180)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-950/70 backdrop-blur-sm",
          isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
        )}
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl transition-all",
          isClosing ? "animate-modal-out" : "animate-modal-in"
        )}
      >
        {isSuccess ? (
          /* Success Screen */
          <div className="p-6 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <IconCircleCheckFilled className="size-10 animate-bounce" />
            </div>

            <h3 className="mt-4 font-heading text-xl font-bold text-foreground">
              {paymentMethod === "vietqr"
                ? "Thanh toán VietQR thành công!"
                : "Đặt hàng ECOME thành công!"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Đơn hàng đã được xác nhận và đang tiến hành đóng gói giao hỏa tốc.
            </p>

            <div className="mt-5 space-y-2.5 rounded-xl border border-border bg-muted/40 p-4 text-left text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <span className="font-mono text-sm font-bold text-foreground">
                  #{orderId}
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted-foreground">Sản phẩm:</span>
                <span className="max-w-[200px] truncate font-semibold text-foreground">
                  {checkoutProduct.name}
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted-foreground">Phương thức:</span>
                <span className="font-semibold text-foreground">
                  {paymentMethod === "vietqr"
                    ? "MB Bank VietQR 24/7 (Đã nhận tiền)"
                    : "COD (Thanh toán khi nhận hàng)"}
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted-foreground">Tổng tiền thanh toán:</span>
                <span className="font-sans text-base font-bold text-primary tabular-nums">
                  {orderTotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                <span className="text-muted-foreground">Dự kiến giao:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Hôm nay trước 18:00 (Freeship 0₫)
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="default"
              onClick={handleClose}
              className="mt-5 h-11 w-full font-bold shadow-none"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconBoltFilled className="size-4.5" />
                </div>
                <div>
                  <h3
                    id="checkout-title"
                    className="font-heading text-sm font-bold text-foreground sm:text-base"
                  >
                    Thanh toán đơn hàng
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Bảo mật chuẩn giao dịch thương mại điện tử
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Đóng"
              >
                <IconX className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[75vh] space-y-4 overflow-y-auto p-4 sm:p-5">
              {/* Product preview */}
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3">
                <img
                  src={checkoutProduct.image}
                  alt={checkoutProduct.name}
                  className="size-14 shrink-0 rounded-lg bg-background object-cover"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">
                    {checkoutProduct.brand}
                  </span>
                  <h4 className="truncate font-heading text-xs font-bold text-foreground sm:text-sm">
                    {checkoutProduct.name}
                  </h4>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="font-sans text-sm font-bold text-foreground tabular-nums">
                      {orderTotal.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="font-sans text-xs text-muted-foreground tabular-nums line-through">
                      {checkoutProduct.originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5 font-bold text-foreground">
                    <IconMapPin className="size-4 text-primary" />
                    Địa chỉ nhận hàng
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDeliveryModalOpen(true)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Thay đổi
                  </button>
                </div>
                <div className="mt-1 text-xs text-foreground">
                  <p className="font-semibold">Nguyễn Văn An • 0918 *** 888</p>
                  <p className="text-[11px] text-muted-foreground">
                    {deliveryAddress.address}, {deliveryAddress.district},{" "}
                    {deliveryAddress.city}
                  </p>
                </div>
              </div>

              {/* Payment Methods Selector */}
              <div>
                <span className="mb-2 block text-xs font-bold text-foreground">
                  Chọn phương thức thanh toán:
                </span>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {/* VietQR MB Bank */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("vietqr")}
                    className={cn(
                      "flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all",
                      paymentMethod === "vietqr"
                        ? "border-2 border-foreground bg-muted/70 text-foreground font-semibold shadow-none"
                        : "border-border hover:border-foreground/30 text-muted-foreground bg-card"
                    )}
                  >
                    <IconQrcode className="size-5 shrink-0 text-primary mt-0.5" />
                    <div className="min-w-0">
                      <span className="block font-bold text-foreground">
                        VietQR MB Bank
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Quét mã tự động 24/7
                      </span>
                    </div>
                  </button>

                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={cn(
                      "flex items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all",
                      paymentMethod === "cod"
                        ? "border-2 border-foreground bg-muted/70 text-foreground font-semibold shadow-none"
                        : "border-border hover:border-foreground/30 text-muted-foreground bg-card"
                    )}
                  >
                    <IconTruckDelivery className="size-5 shrink-0 text-muted-foreground mt-0.5" />
                    <div className="min-w-0">
                      <span className="block font-bold text-foreground">
                        COD (Tiền mặt)
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Kiểm hàng thanh toán
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* REAL VIETQR PANEL (WHEN VIETQR IS SELECTED) */}
              {paymentMethod === "vietqr" ? (
                <div className="space-y-3.5 rounded-xl border border-border bg-muted/20 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <IconBuildingBank className="size-4 text-primary" />
                      <span>Thông tin chuyển khoản MB Bank</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      <IconClock className="size-3.5" />
                      <span>{formattedTimeLeft}</span>
                    </div>
                  </div>

                  {/* QR Image Box */}
                  <div className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-white p-3 text-slate-900 shadow-xs">
                    <img
                      src={vietQrUrl}
                      alt="Mã QR Chuyển khoản VietQR MB Bank"
                      className="size-52 rounded-lg object-contain sm:size-56"
                    />
                    <div className="mt-2 flex items-center gap-1.5 text-center text-[11px] font-bold text-slate-700">
                      <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Mở app ngân hàng bất kỳ để quét mã thanh toán</span>
                    </div>
                  </div>

                  {/* Detail Bank Specs with One-Click Copy */}
                  <div className="space-y-2 text-xs">
                    {/* Ngân hàng */}
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2">
                      <span className="text-muted-foreground">Ngân hàng:</span>
                      <span className="font-bold text-foreground">
                        {BANK_INFO.bankName}
                      </span>
                    </div>

                    {/* Số tài khoản */}
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2">
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
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground hover:bg-muted"
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

                    {/* Chủ tài khoản */}
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2">
                      <span className="text-muted-foreground">Chủ tài khoản:</span>
                      <span className="font-bold text-foreground uppercase tracking-wider">
                        {BANK_INFO.accountName}
                      </span>
                    </div>

                    {/* Số tiền */}
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-3 py-2">
                      <div>
                        <span className="text-muted-foreground">Số tiền:</span>
                        <p className="font-sans text-sm font-black text-primary tabular-nums">
                          {orderTotal.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            orderTotal.toString(),
                            "amount",
                            "Số tiền"
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground hover:bg-muted"
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

                    {/* Nội dung chuyển khoản */}
                    <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-50/50 px-3 py-2 dark:bg-amber-950/20">
                      <div>
                        <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
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
                        className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/60 dark:text-amber-200"
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

                  <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <IconAlertCircle className="size-3.5 shrink-0 mt-0.5 text-amber-500" />
                    <span>
                      Vui lòng giữ nguyên mã <strong>{orderId}</strong> trong nội dung chuyển khoản để hệ thống tự động xác nhận đơn hàng sau 10 giây.
                    </span>
                  </div>
                </div>
              ) : (
                /* COD Explanation */
                <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">
                    Thanh toán khi nhận hàng (COD)
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Bạn chỉ cần thanh toán bằng tiền mặt cho nhân viên giao hàng khi nhận được gói bưu phẩm và kiểm tra sản phẩm nguyên seal.
                  </p>
                </div>
              )}

              {/* Order Cost Summary */}
              <div className="rounded-xl border border-border bg-secondary/50 p-3 text-xs">
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>Tạm tính tiền hàng:</span>
                  <span className="font-sans font-semibold text-foreground tabular-nums">
                    {orderTotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between py-0.5 text-muted-foreground">
                  <span>Phí giao hàng toàn quốc:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Miễn phí (0₫)
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                  <span>Tổng thanh toán:</span>
                  <span className="font-sans text-base text-primary tabular-nums">
                    {orderTotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-border bg-muted/30 p-4">
              <Button
                type="button"
                variant="default"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="h-11.5 w-full font-bold shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <IconLoader2 className="size-4 animate-spin" />
                    <span>
                      {paymentMethod === "vietqr"
                        ? "Đang xác nhận giao dịch MB Bank..."
                        : "Đang tạo đơn hàng COD..."}
                    </span>
                  </>
                ) : (
                  <>
                    <IconCircleCheckFilled className="size-4.5" />
                    <span>
                      {paymentMethod === "vietqr"
                        ? "Tôi đã chuyển khoản thành công"
                        : "Xác nhận đặt hàng COD ngay"}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
