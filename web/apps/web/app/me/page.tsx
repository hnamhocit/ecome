"use client"

import { FormEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  IconMail,
  IconPhone,
  IconCalendar,
  IconCamera,
  IconCheck,
  IconShieldCheck,
} from "@tabler/icons-react"
import { useUserStore } from "@workspace/stores"

export default function ProfilePage() {
  const { user } = useUserStore()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    if (!user) return
    setName(user.name ?? "")
    setPhone(user.phone ?? "")
    setBio(user.bio ?? "")
  }, [user])

  if (!user) {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    )
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    toast.info("Profile update endpoint will be connected in next iteration.")
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/70">
      {/* Background Cover */}
      <div className="relative h-36 w-full bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 sm:h-44">
        {user.backgroundUrl && (
          <img
            src={user.backgroundUrl}
            alt="Cover"
            className="size-full object-cover"
          />
        )}
        <button
          type="button"
          onClick={() => toast.info("Cover upload will be available soon.")}
          className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-xs transition hover:bg-black/80"
        >
          <IconCamera className="size-3.5" />
          <span>Change Cover</span>
        </button>
      </div>

      {/* Avatar & Profile Overview */}
      <div className="px-6 pb-6">
        <div className="relative -mt-12 mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="relative w-fit">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="size-24 rounded-full border-4 border-white object-cover shadow-md dark:border-slate-900"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-full border-4 border-white bg-emerald-600 text-2xl font-bold text-white shadow-md dark:border-slate-900">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => toast.info("Avatar upload will be available soon.")}
              title="Change avatar"
              className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <IconCamera className="size-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-600 dark:text-emerald-400">
              <IconShieldCheck className="size-3.5" />
              Verified Account
            </span>
            <span className="inline-flex items-center gap-1">
              <IconCalendar className="size-3.5" />
              Member since {joinedDate}
            </span>
          </div>
        </div>

        <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your personal profile and contact preferences on ECOME.
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <div className="relative">
                <IconPhone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="No phone number linked"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Account Email
            </label>
            <div className="relative">
              <IconMail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 py-2 pr-3 pl-9 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Bio / About You
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little bit about yourself..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500 active:scale-95"
            >
              <IconCheck className="size-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
