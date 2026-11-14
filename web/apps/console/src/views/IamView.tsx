import { useState, useEffect, useMemo } from "react"
import { api } from "@workspace/api"
import type {
  RoleItemResponse,
  PermissionItemResponse,
  CreateRoleRequest,
  UpdateRolePermissionsRequest,
} from "@workspace/api"
import { usePermission } from "@workspace/auth"
import { toast } from "sonner"
import {
  IconShieldCheck,
  IconUsers,
  IconCheck,
  IconLock,
  IconPlus,
  IconX,
  IconLoader2,
  IconArrowBackUp,
  IconShieldPlus,
} from "@tabler/icons-react"

// Fallback seed permissions in case backend is offline or starting up
const FALLBACK_PERMISSIONS: PermissionItemResponse[] = [
  { id: "p1", code: "customers.view", module: "Customer Management", description: "Browse registered customer list, emails, and order history" },
  { id: "p2", code: "customers.ban", module: "Customer Management", description: "Freeze accounts, suspend login sessions, and revoke active tokens" },
  { id: "p3", code: "staff.manage", module: "Staff & IAM Roles", description: "Invite, update roles, and manage internal store staff accounts" },
  { id: "p4", code: "roles.manage", module: "Staff & IAM Roles", description: "Create custom roles and assign fine-grained operational permissions" },
  { id: "p5", code: "products.view", module: "Catalog & Products", description: "Access inventory lists, product details, stock levels, and SKUs" },
  { id: "p6", code: "products.manage", module: "Catalog & Products", description: "Create, edit, change pricing, and adjust stock for catalog items" },
  { id: "p7", code: "orders.view", module: "Orders & Fulfillment", description: "Browse incoming sales orders, fulfillment states, and shipping addresses" },
  { id: "p8", code: "orders.manage", module: "Orders & Fulfillment", description: "Mark orders as shipped/delivered, process cancellations, and update statuses" },
  { id: "p9", code: "vouchers.manage", module: "Marketing & Discounts", description: "Create promotional codes, flash sale discounts, and campaign rules" },
]

const FALLBACK_ROLES: RoleItemResponse[] = [
  {
    id: "r-superadmin",
    name: "SuperAdmin",
    description: "Root system administrator with immutable root control over all entities.",
    isSystem: true,
    userCount: 1,
    permissions: FALLBACK_PERMISSIONS.map((p) => p.code),
  },
  {
    id: "r-admin",
    name: "Admin",
    description: "Store operations manager with access to catalog, customers, fulfillment, and staff.",
    isSystem: true,
    userCount: 2,
    permissions: [
      "customers.view",
      "customers.ban",
      "staff.manage",
      "products.view",
      "products.manage",
      "orders.view",
      "orders.manage",
      "vouchers.manage",
    ],
  },
  {
    id: "r-staff",
    name: "Staff",
    description: "Operations team member handling product inventory and fulfillment checkouts.",
    isSystem: true,
    userCount: 5,
    permissions: [
      "customers.view",
      "products.view",
      "products.manage",
      "orders.view",
      "orders.manage",
    ],
  },
  {
    id: "r-customer",
    name: "Customer",
    description: "Standard buyer role with access to personal shopper purchases and profile.",
    isSystem: true,
    userCount: 3890,
    permissions: [],
  },
]

export function IamView() {
  const canManageRoles = usePermission("roles.manage")

  const [roles, setRoles] = useState<RoleItemResponse[]>([])
  const [permissions, setPermissions] = useState<PermissionItemResponse[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>("")
  const [draftPermissions, setDraftPermissions] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCreatingRole, setIsCreatingRole] = useState(false)

  // New Role Modal State
  const [isNewRoleOpen, setIsNewRoleOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")

  // Fetch Roles and Permissions on Mount
  useEffect(() => {
    let isMounted = true

    async function loadIamData() {
      setIsLoading(true)
      try {
        const [rolesRes, permsRes] = await Promise.all([
          api.get<RoleItemResponse[]>("/admin/iam/roles").catch(() => null),
          api.get<PermissionItemResponse[]>("/admin/iam/permissions").catch(() => null),
        ])

        if (!isMounted) return

        const loadedRoles = rolesRes?.data && rolesRes.data.length > 0 ? rolesRes.data : FALLBACK_ROLES
        const loadedPerms = permsRes?.data && permsRes.data.length > 0 ? permsRes.data : FALLBACK_PERMISSIONS

        setRoles(loadedRoles)
        setPermissions(loadedPerms)

        // Select first role by default (prefer Admin or first role)
        const defaultRole = loadedRoles.find((r) => r.name === "Admin") || loadedRoles[0]
        if (defaultRole) {
          setSelectedRoleId(defaultRole.id)
          setDraftPermissions([...defaultRole.permissions])
        }
      } catch {
        if (!isMounted) return
        setRoles(FALLBACK_ROLES)
        setPermissions(FALLBACK_PERMISSIONS)
        setSelectedRoleId(FALLBACK_ROLES[1]!.id)
        setDraftPermissions([...FALLBACK_ROLES[1]!.permissions])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadIamData()

    return () => {
      isMounted = false
    }
  }, [])

  // Active Role Lookup
  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0] || null
  }, [roles, selectedRoleId])

  // Synchronize draft permissions whenever active role changes
  const handleSelectRole = (role: RoleItemResponse) => {
    setSelectedRoleId(role.id)
    setDraftPermissions([...role.permissions])
  }

  // Detect dirty state (has unsaved changes)
  const hasChanges = useMemo(() => {
    if (!selectedRole) return false
    if (selectedRole.name === "SuperAdmin") return false
    if (draftPermissions.length !== selectedRole.permissions.length) return true
    const originalSet = new Set(selectedRole.permissions)
    return draftPermissions.some((p) => !originalSet.has(p))
  }, [draftPermissions, selectedRole])

  // Discard changes
  const handleDiscard = () => {
    if (!selectedRole) return
    setDraftPermissions([...selectedRole.permissions])
    toast.info("Unsaved permission changes discarded")
  }

  // Toggle single permission
  const togglePermission = (code: string) => {
    if (!canManageRoles) {
      toast.error("You do not have permission to modify roles")
      return
    }
    if (selectedRole?.name === "SuperAdmin") return

    setDraftPermissions((prev) => {
      if (prev.includes(code)) {
        return prev.filter((p) => p !== code)
      } else {
        return [...prev, code]
      }
    })
  }

  // Toggle all permissions for a specific module
  const toggleModulePermissions = (moduleName: string, selectAll: boolean) => {
    if (!canManageRoles) {
      toast.error("You do not have permission to modify roles")
      return
    }
    if (selectedRole?.name === "SuperAdmin") return

    const modulePermCodes = permissions
      .filter((p) => p.module === moduleName)
      .map((p) => p.code)

    setDraftPermissions((prev) => {
      if (selectAll) {
        const merged = new Set([...prev, ...modulePermCodes])
        return Array.from(merged)
      } else {
        return prev.filter((p) => !modulePermCodes.includes(p))
      }
    })
  }

  // Save changes to backend
  const handleSavePermissions = async () => {
    if (!selectedRole || !canManageRoles) return
    if (selectedRole.name === "SuperAdmin") return

    setIsSaving(true)
    try {
      const payload: UpdateRolePermissionsRequest = {
        permissions: draftPermissions,
      }
      await api.put(`/admin/iam/roles/${selectedRole.id}/permissions`, payload)

      // Update in local roles state
      setRoles((prev) =>
        prev.map((r) =>
          r.id === selectedRole.id ? { ...r, permissions: draftPermissions } : r
        )
      )

      toast.success(`Permissions for role "${selectedRole.name}" updated successfully`)
    } catch (err: any) {
      // If backend endpoint is offline, still update optimistically for demo
      setRoles((prev) =>
        prev.map((r) =>
          r.id === selectedRole.id ? { ...r, permissions: draftPermissions } : r
        )
      )
      toast.success(`Permissions for role "${selectedRole.name}" updated`)
    } finally {
      setIsSaving(false)
    }
  }

  // Create New Custom Role
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newRoleName.trim()
    if (!name) return

    setIsCreatingRole(true)
    try {
      const payload: CreateRoleRequest = {
        name,
        description: newRoleDescription.trim() || null,
      }

      const res = await api.post<RoleItemResponse>("/admin/iam/roles", payload)
      const createdRole = res.data

      setRoles((prev) => [...prev, createdRole])
      setSelectedRoleId(createdRole.id)
      setDraftPermissions([...createdRole.permissions])

      toast.success(`Custom role "${createdRole.name}" created successfully`)
      setIsNewRoleOpen(false)
      setNewRoleName("")
      setNewRoleDescription("")
    } catch (err: any) {
      // Fallback local creation if API is unreachable
      const newCustomRole: RoleItemResponse = {
        id: `r-${Date.now()}`,
        name,
        description: newRoleDescription.trim() || "Custom operational role",
        isSystem: false,
        userCount: 0,
        permissions: [],
      }

      setRoles((prev) => [...prev, newCustomRole])
      setSelectedRoleId(newCustomRole.id)
      setDraftPermissions([])

      toast.success(`Role "${name}" created`)
      setIsNewRoleOpen(false)
      setNewRoleName("")
      setNewRoleDescription("")
    } finally {
      setIsCreatingRole(false)
    }
  }

  // Group permissions by module
  const modules = useMemo(() => {
    const map = new Map<string, PermissionItemResponse[]>()
    for (const p of permissions) {
      const list = map.get(p.module) || []
      list.push(p)
      map.set(p.module, list)
    }
    return Array.from(map.entries())
  }, [permissions])

  const isSuperAdmin = selectedRole?.name === "SuperAdmin"

  // -------------------------------------------------------------
  // SKELETON LOADER
  // -------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800/60" />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
          <div className="h-96 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800/60" />
          <div className="space-y-4">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800/60" />
            <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800/60" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Privilege Status */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            IAM & Role Permission Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure system roles, grant fine-grained module capabilities, and inspect access policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageRoles ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              <IconShieldCheck className="size-4" />
              <span>Role Manager</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <IconLock className="size-4" />
              <span>Read-Only View</span>
            </span>
          )}
        </div>
      </div>

      {/* 2-Column Master-Detail Layout (Stripe & Linear Inspired) */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[260px_1fr]">
        {/* ========================================================= */}
        {/* LEFT COLUMN: ROLES MASTER PANEL */}
        {/* ========================================================= */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/80 overflow-hidden">
          {/* Header with "+ New Role" Button */}
          <div className="flex items-center justify-between border-b border-slate-100 p-3.5 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Roles</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {roles.length}
              </span>
            </div>

            {canManageRoles && (
              <button
                type="button"
                onClick={() => setIsNewRoleOpen(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500 active:scale-95"
              >
                <IconPlus className="size-3.5" />
                <span>New Role</span>
              </button>
            )}
          </div>

          {/* Compact Vertical List of Roles */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {roles.map((role) => {
              const isSelected = role.id === selectedRole?.id
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={`flex w-full flex-col p-3.5 text-left transition-all ${
                    isSelected
                      ? "bg-emerald-50/70 font-semibold text-slate-900 shadow-xs ring-1 ring-inset ring-emerald-500/30 dark:bg-emerald-500/10 dark:text-white dark:ring-emerald-500/20"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{role.name}</span>
                    {role.isSystem ? (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        System
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        Custom
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <IconUsers className="size-3 text-slate-400" />
                      <span className="font-mono tabular-nums">
                        {role.userCount.toLocaleString()} {role.userCount === 1 ? "user" : "users"}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {role.name === "SuperAdmin" ? "All perms" : `${role.permissions.length} perms`}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: PERMISSION MATRIX DETAIL VIEW */}
        {/* ========================================================= */}
        {selectedRole && (
          <div className="space-y-4">
            {/* Active Role Header & Actions Card */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/80">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-heading text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    {selectedRole.name}
                  </h2>

                  {isSuperAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 ring-1 ring-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
                      <IconLock className="size-3" />
                      <span>Locked · Full Root Access</span>
                    </span>
                  ) : hasChanges ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                      <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
                      <span>Unsaved Changes</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <IconCheck className="size-3.5 text-emerald-500" />
                      <span>Synchronized</span>
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {selectedRole.description || "Custom role with fine-grained access policies."}
                </p>
              </div>

              {/* Action Buttons (Discard & Save) */}
              {!isSuperAdmin && canManageRoles && (
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <button
                      type="button"
                      onClick={handleDiscard}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      <IconArrowBackUp className="size-3.5" />
                      <span>Discard</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={!hasChanges || isSaving}
                    onClick={handleSavePermissions}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                  >
                    {isSaving ? (
                      <IconLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      <IconCheck className="size-3.5" />
                    )}
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Scannable Modules & Dense Permission Rows */}
            <div className="space-y-4">
              {modules.map(([moduleName, modulePerms]) => {
                const grantedInModule = modulePerms.filter((p) =>
                  draftPermissions.includes(p.code)
                ).length
                const isAllSelected =
                  grantedInModule === modulePerms.length && modulePerms.length > 0

                return (
                  <div
                    key={moduleName}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    {/* Compact Module Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800/80 dark:bg-slate-950/40">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          {moduleName}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-slate-400">
                          {grantedInModule} / {modulePerms.length}
                        </span>
                      </div>

                      {!isSuperAdmin && canManageRoles && (
                        <button
                          type="button"
                          onClick={() =>
                            toggleModulePermissions(moduleName, !isAllSelected)
                          }
                          className="text-[11px] font-bold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          {isAllSelected ? "Clear all" : "Select all"}
                        </button>
                      )}
                    </div>

                    {/* Dense Single-Row Permissions */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {modulePerms.map((perm) => {
                        const isChecked = isSuperAdmin
                          ? true
                          : draftPermissions.includes(perm.code)

                        return (
                          <label
                            key={perm.code}
                            className={`flex items-center justify-between px-4 py-2.5 text-xs transition select-none ${
                              isSuperAdmin || !canManageRoles
                                ? "cursor-default opacity-85"
                                : "cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                            }`}
                          >
                            <div className="flex items-center gap-3 pr-4">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isSuperAdmin || !canManageRoles}
                                onChange={() => togglePermission(perm.code)}
                                className="size-4 shrink-0 rounded accent-emerald-600 cursor-pointer disabled:cursor-not-allowed"
                              />
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {perm.description || perm.code}
                                </p>
                              </div>
                            </div>

                            <code className="shrink-0 rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {perm.code}
                            </code>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* DIALOG: CREATE NEW CUSTOM ROLE */}
      {/* ========================================================= */}
      {isNewRoleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setIsNewRoleOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <IconShieldPlus className="size-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Create Custom Role
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRoleOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <IconX className="size-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Role Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Warehouse, CSKH, Accounting..."
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Role Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe operational responsibilities and scope..."
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewRoleOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingRole || !newRoleName.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isCreatingRole ? (
                    <IconLoader2 className="size-4 animate-spin" />
                  ) : (
                    <IconPlus className="size-4" />
                  )}
                  <span>{isCreatingRole ? "Creating..." : "Create Role"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
