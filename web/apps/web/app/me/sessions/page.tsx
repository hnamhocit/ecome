"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { api } from "@workspace/api"
import type { UserSessionItem, RevokeOthersResponse } from "@workspace/api"
import {
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDevices,
  IconShieldCheck,
  IconShieldX,
  IconLogout,
  IconLoader2,
  IconWorld,
  IconClock,
  IconTrash,
  IconAlertCircle,
  IconRefresh,
  IconChevronDown,
  IconLock,
  IconCalendar,
} from "@tabler/icons-react"
import { toast } from "sonner"

function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "Never"
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "Recently"
  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return "Just now"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 30) return `${diffDays}d ago`
  const diffMonths = Math.floor(diffDays / 30)
  return `${diffMonths}mo ago`
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Unknown"
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function getDeviceIcon(deviceType: string | null | undefined) {
  switch (deviceType?.toLowerCase()) {
    case "mobile":
      return IconDeviceMobile
    case "tablet":
      return IconDeviceTablet
    case "desktop":
      return IconDeviceLaptop
    default:
      return IconDevices
  }
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<UserSessionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [isConfirmingSignoutOthers, setIsConfirmingSignoutOthers] = useState(false)
  const [isRevokingOthers, setIsRevokingOthers] = useState(false)
  const [expandedUaId, setExpandedUaId] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get<UserSessionItem[]>("/me/sessions")
      setSessions(res.data)
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load active sessions."
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleRevokeSingle = async (session: UserSessionItem) => {
    if (session.isCurrent) {
      toast.error("Cannot revoke your current session. Use logout instead.")
      return
    }

    setRevokingId(session.id)
    const previous = [...sessions]
    setSessions((prev) => prev.filter((s) => s.id !== session.id))

    try {
      await api.delete(`/me/sessions/${session.id}`)
      toast.success(
        `Session on ${session.browser || "device"} (${session.ipAddress || "unknown IP"}) revoked.`
      )
    } catch (err: any) {
      setSessions(previous)
      const msg = err?.response?.data?.message || "Failed to revoke session."
      toast.error(msg)
    } finally {
      setRevokingId(null)
    }
  }

  const handleRevokeOthers = async () => {
    setIsRevokingOthers(true)
    try {
      const res = await api.delete<RevokeOthersResponse>("/me/sessions/others")
      const count = res.data?.revokedCount ?? 0
      setSessions((prev) => prev.filter((s) => s.isCurrent))
      setIsConfirmingSignoutOthers(false)
      toast.success(`Signed out of ${count} other device(s) successfully.`)
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to sign out other devices."
      toast.error(msg)
    } finally {
      setIsRevokingOthers(false)
    }
  }

  const currentSession = useMemo(
    () => sessions.find((s) => s.isCurrent) || sessions[0],
    [sessions]
  )
  const otherSessions = useMemo(
    () => sessions.filter((s) => s.id !== currentSession?.id),
    [sessions, currentSession]
  )

  const CurrentDeviceIcon = getDeviceIcon(currentSession?.deviceType)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Active Sessions & Devices
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Review active devices signed in to your account and revoke any session you don&apos;t recognize.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSessions}
          disabled={isLoading}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-95 disabled:opacity-40 sm:self-center dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <IconRefresh className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Security KPI Snapshot Strip */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <IconDevices className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Active Devices
              </p>
              <p className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                {sessions.length} {sessions.length === 1 ? "Session" : "Sessions"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <IconWorld className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Current Client IP
              </p>
              <p className="truncate font-mono text-sm font-bold text-slate-900 dark:text-white">
                {currentSession?.ipAddress || "::1 (Local)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <IconShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Session Protection
              </p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Active & Encrypted
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          <div className="h-36 w-full animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/80" />
          <div className="h-64 w-full animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/80" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
          <IconShieldX className="size-10 text-rose-500 dark:text-rose-400" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            Unable to load active sessions
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-600 dark:text-slate-400">{error}</p>
          <button
            type="button"
            onClick={fetchSessions}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <IconRefresh className="size-3.5" />
            <span>Try again</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {!isLoading && !error && (
        <div className="space-y-6">
          {/* Current Session Card */}
          {currentSession && (
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 via-white to-white p-5 shadow-xs dark:from-emerald-950/25 dark:via-slate-900/90 dark:to-slate-900/90 dark:border-emerald-500/30">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/25 shadow-xs dark:bg-emerald-500/20 dark:text-emerald-400">
                    <CurrentDeviceIcon className="size-6" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                        {currentSession.browser || "Unknown Browser"} on{" "}
                        {currentSession.os || "Unknown OS"}
                      </h2>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Current Device
                      </span>

                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {currentSession.deviceType || "Desktop"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 font-mono text-slate-700 dark:text-slate-300">
                        <IconWorld className="size-3.5 text-slate-400" />
                        <span>{currentSession.ipAddress || "Unknown IP"}</span>
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <IconCalendar className="size-3.5 text-slate-400" />
                        <span>Signed in {formatDate(currentSession.createdAt)}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold dark:text-emerald-400">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span>Active now</span>
                      </span>
                    </div>

                    {/* Collapsible raw user-agent toggle */}
                    {currentSession.rawUserAgent && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedUaId(
                              expandedUaId === currentSession.id ? null : currentSession.id
                            )
                          }
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        >
                          <IconChevronDown
                            className={`size-3 transition-transform ${
                              expandedUaId === currentSession.id ? "rotate-180" : ""
                            }`}
                          />
                          <span>{expandedUaId === currentSession.id ? "Hide technical details" : "Show technical details"}</span>
                        </button>

                        {expandedUaId === currentSession.id && (
                          <p className="mt-1.5 rounded-lg bg-slate-100/70 p-2 font-mono text-[11px] leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-400 animate-in fade-in duration-150">
                            {currentSession.rawUserAgent}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 sm:text-right">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <IconLock className="size-3.5" />
                    <span>Protected Session</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Other Active Devices Section */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
            {/* Header with Integrated "Sign out all other devices" Button */}
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/80 sm:px-5">
              <div>
                <h2 className="font-heading text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                  Other Active Devices ({otherSessions.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Devices signed into your account that are not this current browser session.
                </p>
              </div>

              {otherSessions.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsConfirmingSignoutOthers(true)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3.5 py-1.5 text-xs font-bold text-rose-700 shadow-xs transition hover:bg-rose-100 active:scale-95 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/60"
                >
                  <IconLogout className="size-3.5" />
                  <span>Sign out all {otherSessions.length} other {otherSessions.length === 1 ? "device" : "devices"}</span>
                </button>
              )}
            </div>

            {otherSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <IconShieldCheck className="size-6" />
                </div>
                <h3 className="mt-3 font-heading text-sm font-bold text-slate-900 dark:text-white">
                  No other active sessions
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  You are only signed in on this current device. No other computers or mobile phones have active access.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {otherSessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.deviceType)
                  const isRevoking = revokingId === session.id
                  const isExpanded = expandedUaId === session.id

                  return (
                    <div
                      key={session.id}
                      className="p-4 transition-colors hover:bg-slate-50/50 sm:px-5 dark:hover:bg-slate-800/30"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3.5">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <DeviceIcon className="size-5" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-heading text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                                {session.browser || "Unknown Browser"} on {session.os || "Unknown OS"}
                              </p>
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {session.deviceType || "Device"}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-mono text-slate-700 dark:text-slate-300">
                                {session.ipAddress || "Unknown IP"}
                              </span>
                              <span>•</span>
                              <span>Signed in {formatDate(session.createdAt)}</span>
                              <span>•</span>
                              <span className="text-slate-600 font-medium dark:text-slate-300">
                                Last active {formatRelativeTime(session.lastUsedAt || session.createdAt)}
                              </span>
                            </div>

                            {session.rawUserAgent && (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setExpandedUaId(isExpanded ? null : session.id)}
                                  className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                >
                                  <IconChevronDown
                                    className={`size-2.5 transition-transform ${
                                      isExpanded ? "rotate-180" : ""
                                    }`}
                                  />
                                  <span>{isExpanded ? "Hide user agent" : "Show user agent"}</span>
                                </button>

                                {isExpanded && (
                                  <p className="mt-1 rounded-md bg-slate-100/70 p-2 font-mono text-[10px] leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-400 animate-in fade-in duration-150">
                                    {session.rawUserAgent}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Revoke Action */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            disabled={isRevoking}
                            onClick={() => handleRevokeSingle(session)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                          >
                            {isRevoking ? (
                              <>
                                <IconLoader2 className="size-3.5 animate-spin" />
                                <span>Revoking...</span>
                              </>
                            ) : (
                              <>
                                <IconTrash className="size-3.5" />
                                <span>Revoke</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Security Best Practices Callout */}
          <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <IconAlertCircle className="size-4.5" />
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Security recommendation:
              </span>{" "}
              If you notice any unfamiliar device or suspicious IP location, revoke that session immediately
              and update your account password.
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Revoking All Other Devices */}
      {isConfirmingSignoutOthers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => !isRevokingOthers && setIsConfirmingSignoutOthers(false)}
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                <IconLogout className="size-5" />
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Sign out of all other devices?
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  This will immediately revoke access from all {otherSessions.length} other devices
                  or browsers currently logged in. You will stay signed in on this current browser.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isRevokingOthers}
                onClick={() => setIsConfirmingSignoutOthers(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isRevokingOthers}
                onClick={handleRevokeOthers}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs shadow-rose-600/20 transition hover:bg-rose-500 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
              >
                {isRevokingOthers ? (
                  <>
                    <IconLoader2 className="size-3.5 animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  <>
                    <IconLogout className="size-3.5" />
                    <span>Sign out other devices</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
