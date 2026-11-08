"use client"

import React, { useState, useEffect } from "react"
import { useStore } from "@/context/store-context"

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useStore()
  const [tab, setTab] = useState<"login" | "register">("login")
  const [emailOrPhone, setEmailOrPhone] = useState("nam.nguyen@ecome.vn")
  const [password, setPassword] = useState("••••••••")
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isAuthModalOpen) {
      setIsClosing(false)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isAuthModalOpen])

  if (!isAuthModalOpen) return null

  const handleClose = () => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      setIsAuthModalOpen(false)
      setIsClosing(false)
    }, 180)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({
      name: emailOrPhone.includes("@")
        ? emailOrPhone.split("@")[0]
        : "Nguyễn Nam",
      email: emailOrPhone.includes("@")
        ? emailOrPhone
        : `${emailOrPhone}@ecome.vn`,
    })
  }

  const handleQuickDemoLogin = () => {
    login({
      name: "Nguyễn Nam",
      email: "nam.nguyen@ecome.vn",
      role: "Thành viên VIP Kim Cương",
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cửa sổ đăng nhập và đăng ký tài khoản ECOME"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200 ${
          isClosing ? "animate-backdrop-out" : "animate-backdrop-in"
        }`}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-7 dark:border-slate-800 dark:bg-slate-900 ${
          isClosing ? "animate-modal-out" : "animate-modal-in"
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          title="Đóng cửa sổ"
        >
          <i className="ti ti-x text-lg" />
        </button>

        {/* Brand Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2.5 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="font-heading text-2xl font-black">E</span>
          </div>
          <h3 className="font-heading text-xl font-black text-slate-900 dark:text-white">
            {tab === "login"
              ? "Chào mừng trở lại ECOME"
              : "Tạo tài khoản ECOME"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {tab === "login"
              ? "Đăng nhập để nhận voucher 50k & theo dõi đơn hàng"
              : "Trở thành hội viên để nhận ưu đãi Freeship không giới hạn"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-5 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === "login"
                ? "bg-white text-emerald-600 shadow-xs dark:bg-slate-900 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
              tab === "register"
                ? "bg-white text-emerald-600 shadow-xs dark:bg-slate-900 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email hoặc Số điện thoại
            </label>
            <div className="relative flex items-center">
              <i className="ti ti-mail absolute left-3.5 text-base text-slate-400" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="nam.nguyen@ecome.vn / 0909 123 456"
                className="h-10.5 w-full rounded-xl border border-slate-200 bg-white pr-3.5 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mật khẩu
              </label>
              {tab === "login" && (
                <a
                  href="#"
                  className="text-[11px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Quên mật khẩu?
                </a>
              )}
            </div>
            <div className="relative flex items-center">
              <i className="ti ti-lock absolute left-3.5 text-base text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="h-10.5 w-full rounded-xl border border-slate-200 bg-white pr-3.5 pl-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-98"
          >
            <i className="ti ti-login text-base" />
            <span>
              {tab === "login" ? "Đăng nhập ngay" : "Tạo tài khoản hội viên"}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-[11px] text-slate-400">Hoặc tiếp tục với</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Quick Demo Login Button */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="mb-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50 px-4 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
        >
          <i className="ti ti-user-check text-base text-emerald-600" />
          <span>Đăng nhập nhanh với tài khoản Demo (Nguyễn Nam)</span>
        </button>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="flex h-9.5 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <i className="ti ti-brand-google text-base text-rose-500" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="flex h-9.5 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <i className="ti ti-brand-facebook text-base text-[#1877F2]" />
            <span>Facebook</span>
          </button>
        </div>
      </div>
    </div>
  )
}
