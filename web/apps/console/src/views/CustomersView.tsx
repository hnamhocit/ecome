import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { api } from "@workspace/api"
import type {
  AdminUserItemResponse,
  PagedResponseOfAdminUserItemResponse,
  RoleItemResponse,
  UpdateUserRolesRequest,
  UpdateUserStatusRequest,
} from "@workspace/api"
import { usePermission } from "@workspace/auth"
import { useUserStore } from "@workspace/stores"
import { toast } from "sonner"
import {
  IconSearch,
  IconShield,
  IconShieldCheck,
  IconDotsVertical,
  IconUserX,
  IconUserCheck,
  IconEdit,
  IconX,
  IconCheck,
  IconLoader2,
  IconChevronLeft,
  IconChevronRight,
  IconBuildingStore,
  IconUser,
  IconUsers,
  IconRefresh,
  IconCopy,
  IconLock,
} from "@tabler/icons-react"
import { Select } from "../components/ui/Select"

const FALLBACK_ROLES: RoleItemResponse[] = [
  { id: "r1", name: "SuperAdmin", description: "Root system administrator", isSystem: true, userCount: 1, permissions: [] },
  { id: "r2", name: "Admin", description: "Store manager", isSystem: true, userCount: 2, permissions: [] },
  { id: "r3", name: "Staff", description: "Operations staff", isSystem: true, userCount: 5, permissions: [] },
  { id: "r4", name: "Seller", description: "Merchant seller", isSystem: false, userCount: 12, permissions: [] },
  { id: "r5", name: "Customer", description: "Shopping buyer", isSystem: true, userCount: 3890, permissions: [] },
]

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—"
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function getRoleBadge(role: string) {
  switch (role) {
    case "SuperAdmin":
      return {
        bg: "bg-purple-50 text-purple-700 ring-1 ring-purple-500/20 dark:bg-purple-500/15 dark:text-purple-300 dark:ring-purple-500/30",
        icon: IconShieldCheck,
      }
    case "Admin":
      return {
        bg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
        icon: IconShield,
      }
    case "Staff":
      return {
        bg: "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30",
        icon: IconUsers,
      }
    case "Seller":
      return {
        bg: "bg-amber-50 text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
        icon: IconBuildingStore,
      }
    default:
      return {
        bg: "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
        icon: IconUser,
      }
  }
}

export function CustomersView() {
  const currentUser = useUserStore((s) => s.user)
  const isCurrentUserSuperAdmin = currentUser?.roles?.includes("SuperAdmin") ?? false

  const canManageStaff = usePermission("staff.manage")
  const canBanCustomers = usePermission("customers.ban")
  const hasAnyActionPermission = canManageStaff || canBanCustomers

  // Server data state
  const [users, setUsers] = useState<AdminUserItemResponse[]>([])
  const [roles, setRoles] = useState<RoleItemResponse[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Filter state
  const [search, setSearch] = useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Modals state
  const [roleModalUser, setRoleModalUser] = useState<AdminUserItemResponse | null>(null)
  const [draftRoles, setDraftRoles] = useState<string[]>([])
  const [isUpdatingRoles, setIsUpdatingRoles] = useState<boolean>(false)

  const [statusModalUser, setStatusModalUser] = useState<AdminUserItemResponse | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false)

  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page when filters change
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value)
    setPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }

  // Close actions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setActiveActionMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch roles list on mount
  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await api.get<RoleItemResponse[]>("/admin/iam/roles")
        if (res.data && res.data.length > 0) {
          setRoles(res.data)
        } else {
          setRoles(FALLBACK_ROLES)
        }
      } catch {
        setRoles(FALLBACK_ROLES)
      }
    }
    loadRoles()
  }, [])

  // Fetch paginated users from API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: Record<string, any> = {
        page,
        pageSize,
      }
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
      if (roleFilter !== "all") params.role = roleFilter
      if (statusFilter === "true") params.isActive = true
      if (statusFilter === "false") params.isActive = false

      const res = await api.get<PagedResponseOfAdminUserItemResponse>("/admin/users", { params })
      const data = res.data

      setUsers(data.items || [])
      setTotalCount(typeof data.totalCount === "number" ? data.totalCount : parseInt(String(data.totalCount || 0), 10))
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load users directory."
      toast.error(msg)
      setUsers([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, debouncedSearch, roleFilter, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Dynamic Role Filter Options
  const roleOptions = useMemo(() => {
    const list = [
      { value: "all", label: "All Roles" },
      { value: "internal", label: "Internal Staff" },
    ]
    for (const r of roles) {
      list.push({ value: r.name, label: r.name })
    }
    return list
  }, [roles])

  // Status Filter Options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "true", label: "Active" },
    { value: "false", label: "Suspended" },
  ]

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const fromIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const toIndex = Math.min(page * pageSize, totalCount)

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("")
    setDebouncedSearch("")
    setRoleFilter("all")
    setStatusFilter("all")
    setPage(1)
  }

  // Open Role Assignment Modal
  const handleOpenRoleModal = (user: AdminUserItemResponse) => {
    setRoleModalUser(user)
    setDraftRoles(user.roles && user.roles.length > 0 ? [...user.roles] : ["Customer"])
    setActiveActionMenuId(null)
  }

  // Toggle role in draft list
  const handleToggleDraftRole = (roleName: string) => {
    if (roleName === "SuperAdmin" && !isCurrentUserSuperAdmin) {
      toast.error("Only SuperAdmin can assign the SuperAdmin role.")
      return
    }

    setDraftRoles((prev) => {
      if (prev.includes(roleName)) {
        // Prevent removing all roles
        if (prev.length <= 1) {
          toast.error("A user must have at least one assigned role.")
          return prev
        }
        return prev.filter((r) => r !== roleName)
      } else {
        return [...prev, roleName]
      }
    })
  }

  // Save Role Changes
  const handleSaveRolesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleModalUser) return

    setIsUpdatingRoles(true)
    try {
      const payload: UpdateUserRolesRequest = {
        roles: draftRoles,
      }
      await api.put(`/admin/users/${roleModalUser.id}/roles`, payload)

      toast.success(`Roles updated for ${roleModalUser.name}`)
      setUsers((prev) =>
        prev.map((u) => (u.id === roleModalUser.id ? { ...u, roles: draftRoles } : u))
      )
      setRoleModalUser(null)
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update user roles."
      toast.error(msg)
    } finally {
      setIsUpdatingRoles(false)
    }
  }

  // Open Status Confirmation Dialog
  const handleOpenStatusModal = (user: AdminUserItemResponse) => {
    setStatusModalUser(user)
    setActiveActionMenuId(null)
  }

  // Confirm Suspend / Reactivate
  const handleConfirmStatusChange = async () => {
    if (!statusModalUser) return

    const newActiveState = !statusModalUser.isActive
    setIsUpdatingStatus(true)
    try {
      const payload: UpdateUserStatusRequest = {
        isActive: newActiveState,
      }
      await api.put(`/admin/users/${statusModalUser.id}/status`, payload)

      toast.success(
        `Account for ${statusModalUser.name} has been ${
          newActiveState ? "reactivated" : "suspended"
        }.`
      )
      setUsers((prev) =>
        prev.map((u) => (u.id === statusModalUser.id ? { ...u, isActive: newActiveState } : u))
      )
      setStatusModalUser(null)
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update account status."
      toast.error(msg)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Customers & Staff Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Browse registered customers, team members, operational roles, and access states.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <IconRefresh className={`size-3.5 ${isLoading ? "animate-spin text-emerald-500" : ""}`} />
            <span>Refresh</span>
          </button>

          <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Total Users: <strong className="font-mono text-emerald-600 dark:text-emerald-400">{totalCount}</strong>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar with Design Token Select */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/90">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Role Filter with Design Tokens */}
          <Select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            options={roleOptions}
            className="w-44"
          />

          {/* Custom Status Filter with Design Tokens */}
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={statusOptions}
            className="w-36"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                <th className="py-4 pl-5">User Profile</th>
                <th className="py-4">Role & Access</th>
                <th className="py-4">Orders</th>
                <th className="py-4">Status</th>
                <th className="py-4">Joined Date</th>
                <th className="py-4 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {/* SKELETON ROWS */}
              {isLoading && (
                <>
                  {[...Array(6)].map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="animate-pulse">
                      <td className="py-4 pl-5">
                        <div className="flex items-center gap-3.5">
                          <div className="size-11 rounded-full bg-slate-200 dark:bg-slate-800" />
                          <div className="space-y-1.5">
                            <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="h-3 w-44 rounded bg-slate-100 dark:bg-slate-800/60" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
                      </td>
                      <td className="py-4">
                        <div className="h-4 w-16 rounded bg-slate-100 dark:bg-slate-800/60" />
                      </td>
                      <td className="py-4">
                        <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                      </td>
                      <td className="py-4">
                        <div className="h-4 w-24 rounded bg-slate-100 dark:bg-slate-800/60" />
                      </td>
                      <td className="py-4 pr-5 text-right">
                        <div className="ml-auto size-8 rounded-xl bg-slate-100 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))}
                </>
              )}

              {/* EMPTY STATE */}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      <IconUsers className="size-6" />
                    </div>
                    <h3 className="mt-3 font-heading text-sm font-bold text-slate-900 dark:text-white">
                      No users found
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {search || roleFilter !== "all" || statusFilter !== "all"
                        ? "No registered users match your search query or selected filters."
                        : "No user records exist in the directory yet."}
                    </p>
                    {(search || roleFilter !== "all" || statusFilter !== "all") && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <IconRefresh className="size-3.5" />
                        <span>Reset filters</span>
                      </button>
                    )}
                  </td>
                </tr>
              )}

              {/* USER ROWS */}
              {!isLoading &&
                users.map((user) => {
                  const isSuperAdmin = user.roles?.includes("SuperAdmin") ?? false
                  const isSelf = currentUser?.id === user.id
                  const userRoles = user.roles && user.roles.length > 0 ? user.roles : ["Customer"]

                  return (
                    <tr key={user.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      {/* Avatar & User Details */}
                      <td className="py-4 pl-5">
                        <div className="flex items-center gap-3.5">
                          {user.photoUrl ? (
                            <img
                              src={user.photoUrl}
                              alt={user.name}
                              referrerPolicy="no-referrer"
                              className="size-11 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-800"
                            />
                          ) : (
                            <div className="flex size-11 items-center justify-center rounded-full bg-emerald-500/15 font-heading text-sm font-bold text-emerald-600 ring-2 ring-slate-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:ring-slate-800">
                              {(user.name || user.email || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-sm font-bold text-slate-900 leading-tight dark:text-white">
                                {user.name || "Unnamed User"}
                              </p>
                              {isSelf && (
                                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                            {user.phone && (
                              <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500">{user.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Badges */}
                      <td className="py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {userRoles.map((role) => {
                            const badge = getRoleBadge(role)
                            const IconComp = badge.icon
                            return (
                              <span
                                key={role}
                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${badge.bg}`}
                              >
                                <IconComp className="size-3.5" />
                                <span>{role}</span>
                              </span>
                            )
                          })}
                        </div>
                      </td>

                      {/* Orders count */}
                      <td className="py-4 font-mono text-xs font-semibold text-slate-500 tabular-nums dark:text-slate-400">
                        0 orders
                      </td>

                      {/* Status Badge */}
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            user.isActive
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              user.isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          <span>{user.isActive ? "Active" : "Suspended"}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions Menu */}
                      <td className="relative py-4 pr-5 text-right">
                        {hasAnyActionPermission ? (
                          <div className="inline-block text-left">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveActionMenuId(
                                  activeActionMenuId === user.id ? null : user.id
                                )
                              }
                              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                              <IconDotsVertical className="size-4" />
                            </button>

                            {/* Dropdown Action Popover */}
                            {activeActionMenuId === user.id && (
                              <div
                                ref={actionMenuRef}
                                className="absolute top-12 right-5 z-30 w-52 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl animate-in fade-in duration-150 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl"
                              >
                                {/* Assign Roles */}
                                {canManageStaff && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenRoleModal(user)}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                  >
                                    <IconEdit className="size-4 text-emerald-500" />
                                    <span>Assign Roles</span>
                                  </button>
                                )}

                                {/* Copy User ID */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(user.id)
                                    toast.success("User ID copied to clipboard")
                                    setActiveActionMenuId(null)
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                  <IconCopy className="size-4 text-slate-400" />
                                  <span>Copy User ID</span>
                                </button>

                                {/* Suspend / Reactivate */}
                                {canBanCustomers && (
                                  <>
                                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                    {isSelf || isSuperAdmin ? (
                                      <div
                                        title={
                                          isSelf
                                            ? "Cannot suspend your own account"
                                            : "SuperAdmin accounts cannot be suspended"
                                        }
                                        className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-400 opacity-60 dark:text-slate-600"
                                      >
                                        <IconLock className="size-4" />
                                        <span>Protected Account</span>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleOpenStatusModal(user)}
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition ${
                                          user.isActive
                                            ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                                            : "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                        }`}
                                      >
                                        {user.isActive ? (
                                          <>
                                            <IconUserX className="size-4" />
                                            <span>Suspend Account</span>
                                          </>
                                        ) : (
                                          <>
                                            <IconUserCheck className="size-4" />
                                            <span>Reactivate Account</span>
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!isLoading && totalCount > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-3.5 sm:flex-row dark:border-slate-800 dark:bg-slate-950/50">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Showing <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">{fromIndex}</span>–
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">{toIndex}</span> of{" "}
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">{totalCount}</span> users
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <IconChevronLeft className="size-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                Page <strong className="font-mono text-slate-900 dark:text-white">{page}</strong> of{" "}
                <strong className="font-mono text-slate-900 dark:text-white">{totalPages}</strong>
              </span>

              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <span>Next</span>
                <IconChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ASSIGN ROLES MODAL */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => !isUpdatingRoles && setRoleModalUser(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <IconShield className="size-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Assign Roles: {roleModalUser.name}
                </h3>
              </div>
              <button
                type="button"
                disabled={isUpdatingRoles}
                onClick={() => setRoleModalUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <IconX className="size-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveRolesSubmit} className="mt-4 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select one or more roles to grant operational capabilities to this account:
              </p>

              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {roles.map((r) => {
                  const isChecked = draftRoles.includes(r.name)
                  const isSuperAdminDisabled = r.name === "SuperAdmin" && !isCurrentUserSuperAdmin

                  return (
                    <label
                      key={r.id}
                      className={`flex cursor-pointer items-start justify-between rounded-xl border p-3 text-xs transition ${
                        isSuperAdminDisabled
                          ? "cursor-not-allowed opacity-50 border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
                          : isChecked
                          ? "border-emerald-500 bg-emerald-50/50 font-semibold text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          disabled={isSuperAdminDisabled}
                          checked={isChecked}
                          onChange={() => handleToggleDraftRole(r.name)}
                          className="mt-0.5 size-4 rounded accent-emerald-600"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">{r.name}</span>
                            {r.isSystem && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                SYSTEM
                              </span>
                            )}
                          </div>
                          {r.description && (
                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                              {r.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {isChecked && (
                        <IconCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </label>
                  )
                })}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isUpdatingRoles}
                  onClick={() => setRoleModalUser(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingRoles}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                >
                  {isUpdatingRoles ? (
                    <>
                      <IconLoader2 className="size-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Roles</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM SUSPEND / REACTIVATE MODAL */}
      {statusModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => !isUpdatingStatus && setStatusModalUser(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 dark:border-slate-800 dark:bg-slate-950">
            <div
              className={`flex size-12 items-center justify-center rounded-2xl ${
                statusModalUser.isActive
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              }`}
            >
              {statusModalUser.isActive ? (
                <IconUserX className="size-6" />
              ) : (
                <IconUserCheck className="size-6" />
              )}
            </div>

            <h3 className="mt-4 font-heading text-base font-bold text-slate-900 dark:text-white">
              {statusModalUser.isActive ? "Suspend User Account?" : "Reactivate User Account?"}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {statusModalUser.isActive ? (
                <>
                  Are you sure you want to suspend{" "}
                  <strong className="text-slate-900 dark:text-white">{statusModalUser.name}</strong>?
                  This user will be immediately logged out and prevented from signing in.
                </>
              ) : (
                <>
                  Reactivating will allow{" "}
                  <strong className="text-slate-900 dark:text-white">{statusModalUser.name}</strong> to
                  sign in and access authorized store functions again.
                </>
              )}
            </p>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={() => setStatusModalUser(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={handleConfirmStatusChange}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition active:scale-95 disabled:pointer-events-none disabled:opacity-40 ${
                  statusModalUser.isActive
                    ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                }`}
              >
                {isUpdatingStatus ? (
                  <>
                    <IconLoader2 className="size-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{statusModalUser.isActive ? "Suspend Account" : "Reactivate Account"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
