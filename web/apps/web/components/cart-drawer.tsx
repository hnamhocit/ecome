"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/context/store-context"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import {
  IconShoppingCartFilled,
  IconX,
  IconTruckDelivery,
  IconShoppingCartOff,
  IconTrash,
  IconMinus,
  IconPlus,
  IconCircleCheckFilled,
  IconLockFilled,
} from "@tabler/icons-react"

export function CartDrawer() {
  const router = useRouter()
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    totalCartItems,
    setCheckoutProduct,
    addToast,
  } = useStore()

  const [isClosing, setIsClosing] = useState(false)
  const [voucherCode, setVoucherCode] = useState("ECOMEFAST")
  const [appliedDiscount, setAppliedDiscount] = useState(50000)
  const [voucherMessage, setVoucherMessage] = useState(
    "Đã áp dụng mã ECOMEFAST (-50.000₫)"
  )

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsCartOpen(false)
      setIsClosing(false)
    }, 250)
  }

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    if (voucherCode.trim().toUpperCase() === "ECOMEFAST") {
      setAppliedDiscount(50000)
      setVoucherMessage("Đã áp dụng mã ECOMEFAST (-50.000₫)")
      addToast({
        title: "Áp dụng voucher thành công!",
        message: "Giảm 50.000₫ cho đơn hàng",
        type: "success",
      })
    } else {
      setAppliedDiscount(0)
      setVoucherMessage("Mã giảm giá không hợp lệ. Thử 'ECOMEFAST'")
    }
  }

  const finalTotal = Math.max(0, cartSubtotal - appliedDiscount)

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop with enter & exit fade */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-950/60 backdrop-blur-sm",
          isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
        )}
        onClick={handleClose}
      />

      {/* Drawer content with enter & exit slide */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={cn(
          "relative z-10 flex h-full w-full max-w-md flex-col bg-card text-card-foreground shadow-2xl",
          isClosing ? "animate-drawer-out" : "animate-drawer-in"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconShoppingCartFilled className="size-4.5" />
            </div>
            <div>
              <h3
                id="cart-title"
                className="font-heading text-base font-bold text-foreground"
              >
                Giỏ hàng của bạn
              </h3>
              <span className="text-xs text-muted-foreground">
                ({totalCartItems} sản phẩm)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
                title="Xóa tất cả"
              >
                Xóa tất cả
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <IconX className="size-4" />
            </button>
          </div>
        </div>

        {/* Freeship Progress */}
        <div className="flex items-center justify-between border-b border-trust-border bg-trust px-5 py-2 text-xs font-bold text-trust-foreground">
          <span className="flex items-center gap-1.5">
            <IconTruckDelivery className="size-4" />
            Đủ điều kiện Freeship Toàn Quốc!
          </span>
          <Badge variant="trust" className="px-1.5 py-0 text-[10px]">
            100% FREE
          </Badge>
        </div>

        {/* Items List */}
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <IconShoppingCartOff className="size-7" />
              </div>
              <h4 className="mt-3 font-heading text-base font-bold text-foreground">
                Giỏ hàng đang trống
              </h4>
              <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
                Khám phá các sản phẩm công nghệ ưu đãi hấp dẫn ngay hôm nay.
              </p>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleClose}
                className="mt-4 font-bold"
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedVariant || idx}`}
                className="flex gap-3 rounded-lg border border-border bg-secondary/50 p-3"
              >
                {/* Image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="size-16 shrink-0 rounded-md bg-background object-cover"
                />

                {/* Details */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="truncate font-heading text-xs font-bold text-foreground">
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedVariant)
                        }
                        className="shrink-0 text-xs text-muted-foreground hover:text-destructive"
                        title="Xoá khỏi giỏ"
                      >
                        <IconTrash className="size-4" />
                      </button>
                    </div>
                    {item.selectedVariant && (
                      <span className="mt-0.5 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {item.selectedVariant}
                      </span>
                    )}
                    <span className="mt-0.5 block text-xs font-bold text-primary">
                      {item.product.brand}
                    </span>
                  </div>

                  {/* Quantity & Price */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded border border-border bg-background">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            -1,
                            item.selectedVariant
                          )
                        }
                        className="flex size-6 items-center justify-center text-muted-foreground hover:bg-muted"
                      >
                        <IconMinus className="size-3" />
                      </button>
                      <span className="w-6 text-center font-sans text-xs font-bold text-foreground tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, 1, item.selectedVariant)
                        }
                        className="flex size-6 items-center justify-center text-muted-foreground hover:bg-muted"
                      >
                        <IconPlus className="size-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-sans text-xs font-bold text-foreground tabular-nums sm:text-sm">
                        {(
                          item.product.salePrice * item.quantity
                        ).toLocaleString("vi-VN")}
                        ₫
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Calculation & CTA */}
        {cart.length > 0 && (
          <div className="border-t border-border bg-muted/30 p-4">
            <form onSubmit={handleApplyVoucher} className="mb-3 flex gap-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Mã giảm giá..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 font-mono text-xs uppercase placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className="font-bold"
              >
                Áp dụng
              </Button>
            </form>

            {voucherMessage && (
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <IconCircleCheckFilled className="size-3.5" />
                {voucherMessage}
              </p>
            )}

            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-sans font-semibold text-foreground tabular-nums">
                  {cartSubtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span className="font-semibold text-primary">
                  Miễn phí (Freeship)
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between font-semibold text-rose-500">
                  <span>Giảm giá Voucher</span>
                  <span className="font-sans tabular-nums">
                    -{appliedDiscount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-1.5 text-sm font-bold text-foreground">
                <span>Tổng thanh toán</span>
                <span className="font-sans text-base text-primary tabular-nums">
                  {finalTotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="default"
              onClick={() => {
                setCheckoutProduct(null)
                setIsCartOpen(false)
                router.push("/checkout")
              }}
              className="mt-3.5 h-11 w-full font-bold shadow-none"
            >
              <IconLockFilled className="size-4" />
              <span>Tiến hành thanh toán</span>
              <span className="ml-1 font-mono tabular-nums">
                ({finalTotal.toLocaleString("vi-VN")}₫)
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
