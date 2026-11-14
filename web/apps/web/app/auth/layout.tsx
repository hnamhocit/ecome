import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#FAFAF9] text-slate-900 lg:grid-cols-2 dark:bg-slate-950 dark:text-slate-100">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-80">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 font-heading text-xl font-black text-white shadow-lg shadow-emerald-500/20">
              E
            </span>
            <span className="font-heading text-2xl font-black tracking-tight text-white">ECOME</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="font-heading text-4xl leading-tight font-extrabold tracking-tight xl:text-5xl">
            Unlimited shopping <br />
            <span className="text-emerald-400">experience.</span>
          </h1>
          <p className="text-base text-slate-400">
            Thousands of genuine tech products, 2-hour express delivery, and exclusive rewards are waiting for you at ECOME Mall.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-600">
          © {new Date().getFullYear()} ECOME Global. All rights reserved.
        </div>
      </aside>

      <main className="relative flex flex-col p-6 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <IconArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500 font-heading text-base font-black text-white">
              E
            </span>
            <span className="font-heading text-lg font-black tracking-tight">ECOME</span>
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
