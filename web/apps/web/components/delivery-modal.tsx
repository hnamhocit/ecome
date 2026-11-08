"use client"

import React, { useState } from "react"
import { useStore } from "@/context/store-context"
import { Button } from "@workspace/ui/components/button"
import { Select } from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

const CITIES = [
  {
    name: "Hồ Chí Minh",
    districts: [
      "Quận 1, Bến Nghé",
      "Quận 3, Võ Thị Sáu",
      "TP. Thủ Đức, An Phú",
      "Quận 7, Tân Phong",
      "Bình Thạnh, Đa Kao",
    ],
  },
  {
    name: "Hà Nội",
    districts: [
      "Hoàn Kiếm, Tràng Tiền",
      "Ba Đình, Liễu Giai",
      "Cầu Giấy, Dịch Vọng",
      "Đống Đa, Ô Chợ Dừa",
      "Tây Hồ, Quảng An",
    ],
  },
  {
    name: "Đà Nẵng",
    districts: [
      "Hải Châu, Thạch Thang",
      "Sơn Trà, An Hải Bắc",
      "Ngũ Hành Sơn, Mỹ An",
    ],
  },
  {
    name: "Cần Thơ",
    districts: ["Ninh Kiều, Tân An", "Cái Răng, Hưng Phú"],
  },
]

export function DeliveryModal() {
  const {
    isDeliveryModalOpen,
    setIsDeliveryModalOpen,
    deliveryAddress,
    setDeliveryAddress,
    addToast,
  } = useStore()

  const [selectedCity, setSelectedCity] = useState(deliveryAddress.city)
  const [selectedDistrict, setSelectedDistrict] = useState(
    deliveryAddress.district
  )
  const [detailAddress, setDetailAddress] = useState(deliveryAddress.address)
  const [isClosing, setIsClosing] = useState(false)

  if (!isDeliveryModalOpen) return null

  const currentCityObj =
    CITIES.find((c) => c.name === selectedCity) ?? CITIES[0]!

  const cityOptions = CITIES.map((c) => ({
    value: c.name,
    label: c.name,
    icon: "ti ti-map-pin",
  }))

  const districtOptions = currentCityObj.districts.map((d) => ({
    value: d,
    label: d,
    icon: "ti ti-building",
  }))

  const handleClose = () => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      setIsDeliveryModalOpen(false)
      setIsClosing(false)
    }, 180)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setDeliveryAddress({
      city: selectedCity,
      district: selectedDistrict,
      address: detailAddress || "Địa chỉ mặc định",
    })
    handleClose()
    addToast({
      title: "Đã cập nhật vị trí giao hàng",
      message: `${selectedDistrict}, ${selectedCity}`,
      type: "info",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with enter & exit animation */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-950/60 backdrop-blur-sm",
          isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
        )}
        onClick={handleClose}
      />

      {/* Modal Dialog with BOTH Entrance (Scale & Fade in) and Exit (Scale & Fade out) */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-2xl",
          isClosing ? "animate-modal-out" : "animate-modal-in"
        )}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <i className="ti ti-map-pin text-xl text-primary" />
            <h3 className="font-heading text-base font-bold text-foreground">
              Chọn địa chỉ nhận hàng
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Đóng"
          >
            <i className="ti ti-x text-base" />
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="mt-4 space-y-3.5 text-xs sm:text-sm"
        >
          <div>
            <label className="mb-1.5 block font-bold text-foreground">
              Tỉnh / Thành phố
            </label>
            <Select
              value={selectedCity}
              onValueChange={(val) => {
                setSelectedCity(val)
                const c = CITIES.find((item) => item.name === val)
                const firstDistrict = c?.districts[0]
                if (firstDistrict) setSelectedDistrict(firstDistrict)
              }}
              options={cityOptions}
              className="w-full"
              triggerClassName="w-full justify-between"
              align="left"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-bold text-foreground">
              Quận / Huyện
            </label>
            <Select
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
              options={districtOptions}
              className="w-full"
              triggerClassName="w-full justify-between"
              align="left"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-bold text-foreground">
              Số nhà, tên đường
            </label>
            <input
              type="text"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              placeholder="VD: Số 68 Nguyễn Huệ"
              className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none sm:text-sm"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="default"
              className="h-11 w-full font-bold"
            >
              Lưu & Cập nhật địa chỉ
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
