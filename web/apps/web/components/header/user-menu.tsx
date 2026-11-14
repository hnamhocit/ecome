"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  IconUser,
  IconChevronDown,
  IconLogout,
  IconReceipt2,
  IconTicket,
  IconDiamondFilled,
  IconLogin,
} from "@tabler/icons-react"
import { useUserStore } from "@workspace/stores"
import { api } from "@workspace/api"

export function UserMenu() {
  const router = useRouter()
  const { user, accessToken, isLoading, setAuth } = useUserStore()

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
    } catch {
      // ignore
    } finally {
      setAuth(null)
      toast.success("Successfully signed out.")
      router.push("/")
      router.refresh()
    }
  }

  if (isLoading) {
    return <div className="h-7 w-24 animate-pulse rounded-full bg-slate-800" />
  }

  if (!accessToken) {
    return (
      <div className="flex items-center gap-1.5">
        <Link
          href="/auth/register"
          className="hidden rounded-md px-2.5 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white sm:block"
        >
          Sign Up
        </Link>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs transition-all hover:bg-emerald-500 active:scale-95"
        >
          <IconLogin className="size-3.5" />
          <span>Sign In</span>
        </Link>
      </div>
    )
  }

  const displayName = user?.name?.trim() || user?.email || "Account"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 py-1 pr-2.5 pl-1.5 text-slate-200 transition-colors hover:border-emerald-500/50 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40">
        {user?.photoUrl ? (
          <img
            src={user.photoUrl}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="size-4.5 rounded-full object-cover"
          />
        ) : user?.name ? (
          <span className="flex size-4.5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
            {user.name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <IconUser className="size-3.5 text-emerald-400" />
        )}

        <span className="max-w-[120px] truncate text-xs font-semibold text-white">
          {displayName}
        </span>
        <IconChevronDown className="size-3 text-slate-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1 pb-1">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                {displayName}
              </p>
              {user?.email && (
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              )}
              <div className="mt-0.5 inline-flex w-fit items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <IconDiamondFilled className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {user?.roles?.includes("SuperAdmin")
                    ? "Super Admin"
                    : user?.roles?.includes("Admin")
                    ? "Admin"
                    : "Member"}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/me" />} className="cursor-pointer">
            <IconUser className="mr-2 size-4 text-slate-400" />
            <span>My Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/me" />}
            className="flex cursor-pointer items-center justify-between"
          >
            <div className="flex items-center">
              <IconReceipt2 className="mr-2 size-4 text-slate-400" />
              <span>My Orders</span>
            </div>
            <span className="flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              0
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/me" />}
            className="flex cursor-pointer items-center justify-between"
          >
            <div className="flex items-center">
              <IconTicket className="mr-2 size-4 text-slate-400" />
              <span>Vouchers</span>
            </div>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              0
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-950/40 dark:focus:text-rose-300"
        >
          <IconLogout className="mr-2 size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
