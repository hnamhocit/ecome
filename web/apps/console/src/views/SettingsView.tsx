import { useState } from "react"
import {
  IconCheck,
  IconShieldCheck,
  IconBuildingStore,
} from "@tabler/icons-react"
import { Select } from "../components/ui/Select"

const CURRENCY_OPTIONS = [
  { value: "VND (₫)", label: "Vietnamese Dong (₫)" },
  { value: "USD ($)", label: "United States Dollar ($)" },
]

export function SettingsView() {
  const [storeName, setStoreName] = useState("ECOME Official Store")
  const [supportEmail, setSupportEmail] = useState("seller-support@ecome.vn")
  const [currency, setCurrency] = useState("VND (₫)")
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Console & Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure business details, operational parameters, currency, and security credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Store Profile */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mb-5 flex items-center gap-2.5 border-b border-slate-100 pb-3.5 dark:border-slate-800">
            <IconBuildingStore className="size-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Store Profile & Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Official Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Support & Contact Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Base Operating Currency
              </label>
              <Select
                value={currency}
                onChange={setCurrency}
                options={CURRENCY_OPTIONS}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mb-5 flex items-center gap-2.5 border-b border-slate-100 pb-3.5 dark:border-slate-800">
            <IconShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Security & Credentials
            </h2>
          </div>

          <div className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900/60">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Session Refresh Token Policy
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Rotating HTTP-only secure cookie with 14-day validity
                </p>
              </div>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                ENFORCED
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-900/60">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Role-Based Access Control (RBAC)
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  SuperAdmin, Admin, Staff, and Customer permission matrix
                </p>
              </div>
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <IconCheck className="size-4" />
              Settings updated successfully!
            </span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 active:scale-95"
          >
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  )
}
