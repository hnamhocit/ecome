import { useState } from "react"
import {
  IconSearch,
  IconShield,
  IconShieldCheck,
  IconDotsVertical,
  IconMail,
  IconUserX,
  IconUserCheck,
  IconTrash,
  IconEdit,
  IconX,
  IconCheck,
  IconSend,
  IconLoader2,
  IconAlertCircle,
} from "@tabler/icons-react"
import { Select } from "../components/ui/Select"

interface UserRecord {
  id: string
  name: string
  email: string
  avatar: string
  role: "SuperAdmin" | "Admin" | "Staff" | "Customer"
  status: "Active" | "Suspended"
  ordersCount: number
  joinedDate: string
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: "usr-01",
    name: "Nguyen Hoang Nam",
    email: "admin@ecome.vn",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    role: "SuperAdmin",
    status: "Active",
    ordersCount: 12,
    joinedDate: "Jan 15, 2026",
  },
  {
    id: "usr-02",
    name: "Alex Morgan",
    email: "alex.m@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    role: "Customer",
    status: "Active",
    ordersCount: 4,
    joinedDate: "Mar 10, 2026",
  },
  {
    id: "usr-03",
    name: "Elena Rostova",
    email: "elena@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    role: "Staff",
    status: "Active",
    ordersCount: 1,
    joinedDate: "Jun 22, 2026",
  },
  {
    id: "usr-04",
    name: "Marcus Vance",
    email: "marcus.v@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    role: "Customer",
    status: "Active",
    ordersCount: 8,
    joinedDate: "Aug 04, 2026",
  },
  {
    id: "usr-05",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    role: "Customer",
    status: "Suspended",
    ordersCount: 2,
    joinedDate: "Sep 18, 2026",
  },
  {
    id: "usr-06",
    name: "David Chen",
    email: "david.chen@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    role: "Admin",
    status: "Active",
    ordersCount: 15,
    joinedDate: "Feb 01, 2026",
  },
]

const ROLE_OPTIONS = [
  { value: "All", label: "All Roles" },
  { value: "SuperAdmin", label: "SuperAdmin" },
  { value: "Admin", label: "Admin" },
  { value: "Staff", label: "Staff" },
  { value: "Customer", label: "Customer" },
]

const STATUS_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Suspended", label: "Suspended" },
]

export function CustomersView() {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  // Modals state
  const [emailModalUser, setEmailModalUser] = useState<UserRecord | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null)

  const [roleModalUser, setRoleModalUser] = useState<UserRecord | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRecord["role"]>("Customer")

  const [deleteModalUser, setDeleteModalUser] = useState<UserRecord | null>(null)
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null)

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "All" || u.role === roleFilter
    const matchesStatus = statusFilter === "All" || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // Handlers
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "Active" ? "Suspended" : "Active"
          return { ...u, status: newStatus }
        }
        return u
      })
    )
    setActiveActionMenuId(null)
  }

  const handleOpenEmailModal = (user: UserRecord) => {
    setEmailModalUser(user)
    setEmailSubject(`Notification from ECOME Storefront`)
    setEmailBody(`Dear ${user.name},\n\nWe are contacting you regarding your ECOME account.\n\nBest regards,\nECOME Support Team`)
    setEmailFeedback(null)
    setActiveActionMenuId(null)
  }

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSendingEmail(true)
    setTimeout(() => {
      setIsSendingEmail(false)
      setEmailFeedback("Email successfully sent to recipient!")
      setTimeout(() => {
        setEmailModalUser(null)
        setEmailFeedback(null)
      }, 1200)
    }, 1000)
  }

  const handleOpenRoleModal = (user: UserRecord) => {
    setRoleModalUser(user)
    setSelectedRole(user.role)
    setActiveActionMenuId(null)
  }

  const handleRoleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleModalUser) return
    setUsers((prev) =>
      prev.map((u) => (u.id === roleModalUser.id ? { ...u, role: selectedRole } : u))
    )
    setRoleModalUser(null)
  }

  const handleConfirmDelete = () => {
    if (!deleteModalUser) return
    setUsers((prev) => prev.filter((u) => u.id !== deleteModalUser.id))
    setDeleteModalUser(null)
    setActiveActionMenuId(null)
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
            Manage buyer accounts, team permissions, security statuses, and communication.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Total Users: <strong className="text-emerald-600 dark:text-emerald-400">{users.length}</strong>
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
            onChange={setRoleFilter}
            options={ROLE_OPTIONS}
            className="w-40"
          />

          {/* Custom Status Filter with Design Tokens */}
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
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
              {filteredUsers.map((user) => {
                const isSuperAdmin = user.role === "SuperAdmin"
                const isAdmin = user.role === "Admin"
                const isStaff = user.role === "Staff"
                const isActive = user.status === "Active"

                return (
                  <tr key={user.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    {/* Avatar & User Details */}
                    <td className="py-4 pl-5">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="size-11 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-800"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                          isSuperAdmin
                            ? "bg-purple-50 text-purple-700 ring-1 ring-purple-500/20 dark:bg-purple-500/15 dark:text-purple-300 dark:ring-purple-500/30"
                            : isAdmin
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30"
                            : isStaff
                            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {isSuperAdmin ? (
                          <IconShieldCheck className="size-3.5" />
                        ) : (
                          <IconShield className="size-3.5" />
                        )}
                        <span>{user.role}</span>
                      </span>
                    </td>

                    {/* Orders count */}
                    <td className="py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {user.ordersCount} orders
                    </td>

                    {/* Status Badge */}
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            isActive ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        <span>{user.status}</span>
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 text-xs text-slate-500 dark:text-slate-400">
                      {user.joinedDate}
                    </td>

                    {/* Actions Menu */}
                    <td className="relative py-4 pr-5 text-right">
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
                        <div className="absolute top-12 right-5 z-30 w-48 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-xl animate-in fade-in duration-150 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl">
                          <button
                            type="button"
                            onClick={() => handleOpenEmailModal(user)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                          >
                            <IconMail className="size-4 text-blue-500" />
                            <span>Send Email</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenRoleModal(user)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                          >
                            <IconEdit className="size-4 text-emerald-500" />
                            <span>Change Role</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user.id)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                          >
                            {isActive ? (
                              <>
                                <IconUserX className="size-4 text-amber-500" />
                                <span>Suspend User</span>
                              </>
                            ) : (
                              <>
                                <IconUserCheck className="size-4 text-emerald-500" />
                                <span>Activate User</span>
                              </>
                            )}
                          </button>

                          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                          <button
                            type="button"
                            onClick={() => {
                              setDeleteModalUser(user)
                              setActiveActionMenuId(null)
                            }}
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/15"
                          >
                            <IconTrash className="size-4" />
                            <span>Delete User</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. SEND EMAIL MODAL */}
      {emailModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setEmailModalUser(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <IconMail className="size-5 text-blue-500" />
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Send Direct Email to {emailModalUser.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEmailModalUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <IconX className="size-4.5" />
              </button>
            </div>

            {emailFeedback ? (
              <div className="my-6 flex flex-col items-center justify-center p-4 text-center">
                <IconCheck className="size-10 text-emerald-500" />
                <p className="mt-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {emailFeedback}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEmailSubmit} className="mt-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    disabled
                    value={emailModalUser.email}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject of your message..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Type your message content here..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEmailModalUser(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingEmail}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {isSendingEmail ? (
                      <IconLoader2 className="size-4 animate-spin" />
                    ) : (
                      <IconSend className="size-4" />
                    )}
                    <span>{isSendingEmail ? "Sending..." : "Send Email"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. CHANGE ROLE MODAL */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setRoleModalUser(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <IconShield className="size-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Update Role for {roleModalUser.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <IconX className="size-4.5" />
              </button>
            </div>

            <form onSubmit={handleRoleChangeSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                {(["Customer", "Staff", "Admin", "SuperAdmin"] as const).map(
                  (role) => (
                    <label
                      key={role}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition ${
                        selectedRole === role
                          ? "border-emerald-500 bg-emerald-50 font-bold text-emerald-900 dark:bg-emerald-950/30 dark:text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={selectedRole === role}
                          onChange={() => setSelectedRole(role)}
                          className="size-4 accent-emerald-600"
                        />
                        <span>{role}</span>
                      </div>
                      {selectedRole === role && (
                        <IconCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </label>
                  )
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500"
                >
                  <span>Apply Role Change</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CONFIRM DELETE MODAL */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setDeleteModalUser(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <IconAlertCircle className="size-6" />
            </div>

            <h3 className="mt-4 font-heading text-base font-bold text-slate-900 dark:text-white">
              Delete User Account
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900 dark:text-white">{deleteModalUser.name}</strong>? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-500"
              >
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
