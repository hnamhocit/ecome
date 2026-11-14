import { useState, useRef, useEffect } from "react"
import { useUserStore } from "@workspace/stores"
import { api } from "@workspace/api"
import {
  IconSearch,
  IconExternalLink,
  IconBell,
  IconLogout,
  IconShield,
  IconChevronDown,
  IconUser,
  IconSettings,
  IconShieldLock,
  IconBuildingStore,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"
import { useNavigate } from "react-router"
import { useTheme } from "../context/ThemeContext"
import { usePermission } from "@workspace/auth"

const WEB_URL = (import.meta as any).env?.VITE_WEB_URL ?? "http://localhost:3000"

export function Header() {
  const { user, setAuth } = useUserStore()
  const { resolvedTheme, toggleTheme } = useTheme()
  const canManageIam = usePermission("roles.manage")
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch {
      // ignore
    } finally {
      setAuth(null)
      window.location.assign(`${WEB_URL}/auth/login`)
    }
  }

  const roleName = user?.roles?.includes("SuperAdmin")
    ? "Super Admin"
    : user?.roles?.includes("Admin")
    ? "Store Admin"
    : user?.roles?.includes("Staff")
    ? "Operations Staff"
    : "Seller"

  const displayName = user?.name?.trim() || user?.email || "Console User"

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/80">
      {/* Global Search Input */}
      <div className="relative w-80 sm:w-96">
        <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* View Storefront */}
        <a
          href={WEB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
        >
          <IconBuildingStore className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">View Store</span>
          <IconExternalLink className="size-3.5 text-slate-400" />
        </a>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          {resolvedTheme === "dark" ? (
            <IconSun className="size-5 text-amber-400 transition-transform duration-200 hover:rotate-45" />
          ) : (
            <IconMoon className="size-5 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <IconBell className="size-5" />
          <span className="absolute top-2 right-2 flex size-2 rounded-full bg-emerald-500" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        {/* User Account Trigger with Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 p-1.5 pr-3 transition hover:border-slate-300 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/90"
          >
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={displayName}
                className="size-8 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden text-left sm:block">
              <p className="max-w-[140px] truncate text-xs font-bold text-slate-900 dark:text-white">
                {displayName}
              </p>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <IconShield className="size-3" />
                <span>{roleName}</span>
              </div>
            </div>
            <IconChevronDown
              className={`size-4 text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
              }`}
            />
          </button>

          {/* User Account Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl">
              {/* Header Info */}
              <div className="border-b border-slate-100 p-3 dark:border-slate-800/80">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {displayName}
                </p>
                {user?.email && (
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                )}
                <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <IconShield className="size-3" />
                  <span>{roleName}</span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-1 py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    navigate("/settings")
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  <IconSettings className="size-4 text-slate-400" />
                  <span>Store Settings</span>
                </button>

                {canManageIam && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false)
                      navigate("/iam")
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  >
                    <IconShieldLock className="size-4 text-slate-400" />
                    <span>IAM & Role Permissions</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-2.5">
                    {resolvedTheme === "dark" ? (
                      <IconSun className="size-4 text-amber-400" />
                    ) : (
                      <IconMoon className="size-4 text-slate-500" />
                    )}
                    <span>Theme</span>
                  </div>
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {resolvedTheme === "dark" ? "Dark" : "Light"}
                  </span>
                </button>

                <a
                  href={`${WEB_URL}/me`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  <IconUser className="size-4 text-slate-400" />
                  <span>My Shopper Profile</span>
                  <IconExternalLink className="ml-auto size-3 text-slate-400 dark:text-slate-500" />
                </a>
              </div>

              <div className="border-t border-slate-100 pt-1.5 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    handleLogout()
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                >
                  <IconLogout className="size-4" />
                  <span>Sign Out of Console</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
