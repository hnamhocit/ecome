"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { useStore } from "@/context/store-context"
import { CATEGORIES } from "@/lib/data"
import {
  IconUser,
  IconReceipt2,
  IconTicket,
  IconLogout,
  IconDiamondFilled,
  IconBuildingStore,
  IconSparkles,
  IconDeviceMobile,
  IconBrandApple,
  IconBrandAndroid,
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandInstagram,
  IconHeadset,
  IconMapPin,
  IconChevronDown,
  IconCheck,
  IconX,
  IconSearch,
  IconBell,
  IconBellFilled,
  IconHeart,
  IconHeartFilled,
  IconShoppingCartFilled,
  IconMenu2,
  IconFlame,
  IconTruckDelivery,
  IconShieldCheck,
} from "@tabler/icons-react"

export function Header() {
  const {
    totalCartItems,
    cartSubtotal,
    setIsCartOpen,
    wishlistCount,
    deliveryAddress,
    setIsDeliveryModalOpen,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    user,
    logout,
    setIsAuthModalOpen,
    addToast,
  } = useStore()

  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isNotificationClosing, setIsNotificationClosing] = useState(false)

  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isCategoryClosing, setIsCategoryClosing] = useState(false)

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  const searchContainerRef = useRef<HTMLDivElement>(null)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const popularSearches = [
    "Sony WH-1000XM5",
    "Keychron K3 Pro",
    "Apple Watch S10",
    "Loa Marshall",
    "Bình giữ nhiệt OLED",
    "iPad Air M2",
  ]

  // Smooth close for Category Dropdown
  const closeCategoryDropdown = useCallback(() => {
    if (!isCategoryOpen || isCategoryClosing) return
    setIsCategoryClosing(true)
    setTimeout(() => {
      setIsCategoryOpen(false)
      setIsCategoryClosing(false)
    }, 150)
  }, [isCategoryOpen, isCategoryClosing])

  // Smooth close for Notification Popover
  const closeNotificationPopover = useCallback(() => {
    if (!isNotificationOpen || isNotificationClosing) return
    setIsNotificationClosing(true)
    setTimeout(() => {
      setIsNotificationOpen(false)
      setIsNotificationClosing(false)
    }, 150)
  }, [isNotificationOpen, isNotificationClosing])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setIsSearchFocused(false)
      }

      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        closeCategoryDropdown()
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        closeNotificationPopover()
      }

      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSearchFocused(false)
        closeCategoryDropdown()
        closeNotificationPopover()
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [closeCategoryDropdown, closeNotificationPopover])

  return (
    <header className="sticky top-0 z-50 w-full shadow-md select-none">
      {/* 1. Top Bar: Kênh Người Bán, Trở thành người bán, Tải App, Kết nối & User Auth */}
      <div className="border-b border-slate-800/80 bg-slate-950 px-4 py-1.5 text-xs text-slate-300 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex w-full items-center justify-between">
          {/* Left: Kênh Người Bán + Trở thành Người bán + Tải App + Kết nối mạng xã hội */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            {/* Kênh Người Bán Link */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                addToast({
                  title: "Kênh Người Bán ECOME",
                  message:
                    "Chuyển tiếp đến Cổng quản lý gian hàng ECOME Seller Center...",
                  type: "info",
                })
              }}
              className="flex items-center gap-1.5 font-semibold text-slate-200 transition-colors hover:text-emerald-400"
              title="Vào Kênh Người Bán"
            >
              <IconBuildingStore className="size-3.5 text-emerald-400" />
              <span>Kênh Người Bán</span>
            </a>

            <span className="text-slate-700">|</span>

            {/* Trở thành Người Bán Link */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                addToast({
                  title: "Trở thành Người Bán",
                  message:
                    "Mở gian hàng kinh doanh 0đ phí khởi tạo cùng ECOME Mall!",
                  type: "success",
                })
              }}
              className="flex items-center gap-1 font-semibold text-amber-400 transition-colors hover:text-amber-300"
              title="Đăng ký mở gian hàng mới trên ECOME"
            >
              <IconSparkles className="size-3 text-amber-400" />
              <span>Trở thành Người bán</span>
            </a>

            <span className="hidden text-slate-700 sm:inline">|</span>

            {/* App Download Links: iOS / Android */}
            <div className="hidden items-center gap-1.5 text-slate-300 sm:flex">
              <IconDeviceMobile className="size-3.5 text-emerald-400" />
              <span>Tải app:</span>
              <a
                href="#"
                className="flex items-center gap-0.5 font-semibold text-slate-200 transition-colors hover:text-emerald-400"
                title="Tải ứng dụng trên App Store"
              >
                <IconBrandApple className="size-3" />
                <span>iOS</span>
              </a>
              <span className="text-slate-600">/</span>
              <a
                href="#"
                className="flex items-center gap-0.5 font-semibold text-slate-200 transition-colors hover:text-emerald-400"
                title="Tải ứng dụng trên Google Play"
              >
                <IconBrandAndroid className="size-3" />
                <span>Android</span>
              </a>
            </div>

            <span className="hidden text-slate-700 md:inline">|</span>

            {/* Social Media Channels */}
            <div className="hidden items-center gap-2 text-slate-300 md:flex">
              <span className="text-[11px] text-slate-400">Kết nối:</span>
              <div className="flex items-center gap-2.5 text-sm">
                <a
                  href="#"
                  className="text-slate-400 transition-colors hover:text-[#1877F2]"
                  title="Facebook ECOME"
                >
                  <IconBrandFacebook className="size-4" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 transition-colors hover:text-white"
                  title="TikTok ECOME"
                >
                  <IconBrandTiktok className="size-4" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 transition-colors hover:text-[#E4405F]"
                  title="Instagram ECOME"
                >
                  <IconBrandInstagram className="size-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Hotline, Trợ giúp, và Trạng Thái User Logged In / Đăng Nhập */}
          <div className="flex items-center gap-3 text-[11px] sm:gap-4 sm:text-xs">
            <div className="hidden items-center gap-1.5 text-slate-300 xl:flex">
              <IconHeadset className="size-3.5 text-emerald-400" />
              <span>
                Hotline:{" "}
                <strong className="font-mono text-white">1900 8888</strong>
              </span>
            </div>

            <a
              href="#"
              className="hidden text-slate-300 transition-colors hover:text-emerald-400 sm:inline"
            >
              Trợ giúp & CSKH
            </a>

            <span className="hidden text-slate-700 sm:inline">|</span>

            {/* User Logged In Profile OR Sign in / Sign up Buttons */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hover:bg-slate-850 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 py-0.5 pr-2.5 pl-1 transition-all hover:border-emerald-500/50 focus:outline-none"
                  title="Menu tài khoản cá nhân"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-5 rounded-full object-cover ring-1 ring-emerald-500/50"
                  />
                  <span className="max-w-[120px] truncate font-semibold text-white">
                    {user.name}
                  </span>
                  <IconChevronDown
                    className={`size-3 text-slate-400 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>

                {/* Animated User Profile Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="animate-dropdown-in absolute top-full right-0 z-50 mt-1.5 w-60 rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    {/* User Mini Profile Header */}
                    <div className="border-b border-slate-100 p-2.5 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="size-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                        />
                        <div className="overflow-hidden">
                          <p className="truncate font-bold text-slate-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="truncate text-[11px] text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <IconDiamondFilled className="size-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{user.role}</span>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="py-1 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          addToast({
                            title: "Tài khoản của tôi",
                            message: "Đang mở bảng điều khiển cá nhân...",
                            type: "info",
                          })
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <IconUser className="size-4 text-slate-400" />
                        <span>Tài khoản của tôi</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          addToast({
                            title: "Đơn mua",
                            message: `Bạn đang có ${user.ordersCount} đơn hàng`,
                            type: "info",
                          })
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <IconReceipt2 className="size-4 text-slate-400" />
                          <span>Đơn mua</span>
                        </div>
                        <span className="flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                          {user.ordersCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          addToast({
                            title: "Kho Voucher",
                            message: `Bạn có ${user.vouchersCount} mã giảm giá sẵn sàng áp dụng`,
                            type: "info",
                          })
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <IconTicket className="size-4 text-slate-400" />
                          <span>Kho voucher</span>
                        </div>
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                          {user.vouchersCount} mã
                        </span>
                      </button>
                    </div>

                    {/* Logout Divider & Action */}
                    <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        <IconLogout className="size-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 font-medium">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-slate-200 transition-colors hover:text-emerald-400"
                >
                  Đăng ký
                </button>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="font-bold text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Header: Tăng chiều cao thêm ~14px (py-3.5 sm:py-4, h-11 search, size-10 icons) */}
      <div className="bg-[#0F172A] px-4 py-3.5 text-white transition-colors duration-200 sm:px-6 sm:py-4 lg:px-8 xl:px-10 dark:bg-[#020617]">
        <div className="flex w-full items-center justify-between gap-3 md:gap-6">
          {/* Brand Logo: ECOME */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="group flex shrink-0 items-center gap-2.5 focus:outline-none"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-sm transition-transform duration-200 group-hover:scale-105">
              <span className="font-heading text-xl font-black text-primary-foreground">
                E
              </span>
            </div>
            <span className="font-heading text-2xl font-black tracking-tight text-white transition-colors group-hover:text-emerald-400 sm:text-3xl">
              ECOME
            </span>
          </a>

          {/* Delivery Location Selector */}
          <button
            type="button"
            onClick={() => setIsDeliveryModalOpen(true)}
            className="hidden h-11 shrink-0 items-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/50 px-3 text-left transition-colors hover:border-primary hover:bg-slate-800 focus:outline-none xl:flex"
            title="Đổi địa chỉ giao hàng"
          >
            <IconMapPin className="shrink-0 size-4.5 text-emerald-400" />
            <div className="text-xs leading-tight">
              <span className="block text-[10px] text-slate-400">
                Giao đến:
              </span>
              <span className="block max-w-[130px] truncate font-semibold text-white">
                {deliveryAddress.city}
              </span>
            </div>
            <IconChevronDown className="size-3 text-slate-400" />
          </button>

          {/* Smart Search Bar: Chiều cao h-11 thoải mái, tích hợp Category Select mượt mà */}
          <div ref={searchContainerRef} className="relative max-w-3xl flex-1">
            <div className="flex h-11 w-full items-center rounded-xl bg-white shadow-inner transition-all focus-within:ring-2 focus-within:ring-primary dark:border dark:border-slate-700 dark:bg-slate-800">
              {/* Category Select with BIDIRECTIONAL ANIMATION (animate-dropdown-in & animate-dropdown-out) */}
              <div
                ref={categoryDropdownRef}
                className="relative hidden md:block"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isCategoryOpen) {
                      closeCategoryDropdown()
                    } else {
                      setIsCategoryOpen(true)
                    }
                  }}
                  className="flex h-11 items-center gap-1.5 rounded-l-xl border-r border-slate-200 bg-slate-100 px-3.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200"
                >
                  <span className="max-w-[125px] truncate font-bold">
                    {selectedCategory}
                  </span>
                  <IconChevronDown
                    className={`size-3 text-slate-400 transition-transform duration-200 ${
                      isCategoryOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {/* Animated Dropdown Menu */}
                {(isCategoryOpen || isCategoryClosing) && (
                  <div
                    className={`absolute top-full left-0 z-50 mt-1.5 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-slate-800 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${
                      isCategoryOpen && !isCategoryClosing
                        ? "animate-dropdown-in"
                        : "animate-dropdown-out pointer-events-none"
                    }`}
                  >
                    <div className="max-h-64 space-y-0.5 overflow-y-auto py-0.5">
                      {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat

                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat)
                              closeCategoryDropdown()
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                              isSelected
                                ? "bg-primary font-bold text-primary-foreground shadow-sm"
                                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className="truncate">{cat}</span>
                            {isSelected && (
                              <IconCheck className="size-3.5 ml-2 shrink-0 text-primary-foreground" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div className="relative flex flex-1 items-center px-3.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Tìm kiếm tai nghe, điện thoại, máy ảnh, gia dụng..."
                  className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-sm dark:text-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Xóa tìm kiếm"
                  >
                    <IconX className="size-3" />
                  </button>
                )}
              </div>

              {/* Search button */}
              <button
                type="button"
                onClick={() => setIsSearchFocused(false)}
                className="flex h-11 w-12 items-center justify-center rounded-r-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none"
                title="Tìm kiếm"
              >
                <IconSearch className="size-4.5" />
              </button>
            </div>

            {/* Keyword Suggestions on Focus */}
            {isSearchFocused && (
              <div className="animate-dropdown-in absolute top-full right-0 left-0 z-50 mt-1.5 rounded-xl border border-slate-200 bg-white p-3 text-slate-800 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <div className="mb-2 text-[11px] font-bold text-slate-400">
                  Từ khóa hot:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item)
                        setIsSearchFocused(false)
                      }}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons: Height h-11, size-10 buttons, comfortable spacing */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div ref={notificationRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  if (isNotificationOpen) {
                    closeNotificationPopover()
                  } else {
                    setIsNotificationOpen(true)
                    setUnreadNotifications(0)
                  }
                }}
                className="relative flex size-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                title="Thông báo"
              >
                {unreadNotifications > 0 ? (
                  <IconBellFilled className="size-5 text-amber-400" />
                ) : (
                  <IconBell className="size-5" />
                )}
                {unreadNotifications > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow ring-1 ring-slate-900">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Animated Notification Popover */}
              {(isNotificationOpen || isNotificationClosing) && (
                <div
                  className={`absolute top-full right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3.5 text-slate-800 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 ${
                    isNotificationOpen && !isNotificationClosing
                      ? "animate-dropdown-in"
                      : "animate-dropdown-out pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-bold dark:border-slate-800">
                    <span>Thông báo mới</span>
                    <button
                      type="button"
                      onClick={closeNotificationPopover}
                      className="text-[11px] font-semibold text-emerald-600 hover:underline"
                    >
                      Đã đọc tất cả
                    </button>
                  </div>
                  <div className="mt-2.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Đơn hàng #ECM-9824 đang giao
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        Shipper đang giao tai nghe Sony WH-1000XM5 đến bạn.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <a
              href="#products"
              className="relative flex size-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              title="Danh sách yêu thích"
            >
              {wishlistCount > 0 ? (
                <IconHeartFilled className="size-5 text-rose-500 animate-heart-pop" />
              ) : (
                <IconHeart className="size-5" />
              )}
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow ring-1 ring-slate-900">
                  {wishlistCount}
                </span>
              )}
            </a>

            {/* Cart Button: Mở Cart Drawer */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="group flex h-11 items-center gap-2.5 rounded-xl bg-primary px-3.5 text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-98 cursor-pointer"
              title="Xem giỏ hàng"
            >
              <div className="relative flex items-center">
                <IconShoppingCartFilled className="size-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex size-4.5 items-center justify-center rounded-full bg-white text-[10px] font-black text-emerald-900 shadow">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <div className="hidden items-center gap-1.5 text-xs sm:flex">
                <span className="font-medium opacity-90">Giỏ:</span>
                <span className="font-bold tabular-nums">
                  {cartSubtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Bar */}
      <div className="border-t border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-200 sm:px-6 lg:px-8 xl:px-10 dark:bg-slate-950">
        <div className="no-scrollbar flex w-full items-center justify-between gap-4 overflow-x-auto">
          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setSelectedCategory("Tất cả danh mục")}
              className="flex items-center gap-1.5 py-0.5 font-bold text-white hover:text-emerald-400"
            >
              <IconMenu2 className="size-3.5" />
              <span>Tất cả danh mục</span>
            </button>
            <span className="text-slate-700">|</span>
            <a
              href="#products"
              className="flex items-center gap-1 font-semibold text-slate-200 transition-colors hover:text-white"
            >
              <IconFlame className="size-3.5 text-amber-400" />
              <span>Deal chớp nhoáng</span>
              <span className="py-0.2 rounded border border-rose-500/30 bg-rose-500/20 px-1 text-[10px] font-bold text-rose-400">
                -33%
              </span>
            </a>
            <a
              href="#products"
              className="hidden font-medium text-slate-300 transition-colors hover:text-white sm:inline"
            >
              Bán chạy nhất
            </a>
            <a
              href="#products"
              className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300"
            >
              <IconTruckDelivery className="size-3.5" />
              <span>Freeship Xtra</span>
            </a>
            <a
              href="#products"
              className="hidden font-medium text-slate-300 transition-colors hover:text-white md:inline"
            >
              Chính hãng 100%
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <IconShieldCheck className="size-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Thanh toán bảo mật SSL</span>
          </div>
        </div>
      </div>
    </header>
  )
}
