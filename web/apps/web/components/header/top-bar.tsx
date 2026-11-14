"use client"

import { UserMenu } from "./user-menu"
import {
  IconBuildingStore,
  IconSparkles,
  IconDeviceMobile,
  IconBrandApple,
  IconBrandAndroid,
  IconHeadset,
  IconSun,
  IconMoon,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { SOCIAL_APPS } from "@/constants"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

export function TopBar() {
  const consoleUrl = process.env.NEXT_PUBLIC_CONSOLE_URL ?? "http://localhost:5173"
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="h-10 border-b border-slate-800/80 bg-slate-950 px-4 py-1.5 text-xs text-slate-300 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex w-full items-center justify-between">
        {/* Left: Links & Socials */}
        <div className="flex items-center gap-3 text-[11px] sm:text-xs">
          <a
            href={consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-semibold text-slate-200 hover:text-emerald-400"
          >
            <IconBuildingStore className="size-3.5 text-emerald-400" />
            <span>Seller Center</span>
          </a>

          <span className="text-slate-700">|</span>

          <a
            href={consoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300"
          >
            <IconSparkles className="size-3 text-amber-400" />
            <span>Become a Seller</span>
          </a>

          <span className="hidden text-slate-700 sm:inline">|</span>

          <div className="hidden items-center gap-1.5 text-slate-300 sm:flex">
            <IconDeviceMobile className="size-3.5 text-emerald-400" />
            <span>Download App:</span>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-0.5 font-semibold text-slate-200 hover:text-emerald-400"
            >
              <IconBrandApple className="size-3" />
              <span>iOS</span>
            </a>
            <span className="text-slate-600">/</span>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-0.5 font-semibold text-slate-200 hover:text-emerald-400"
            >
              <IconBrandAndroid className="size-3" />
              <span>Android</span>
            </a>
          </div>

          <span className="hidden text-slate-700 md:inline">|</span>

          {/* Social Media Channels */}
          <div className="hidden items-center gap-2 text-slate-300 md:flex">
            <span className="text-[11px] text-slate-400">Follow us:</span>
            <div className="flex items-center gap-2.5 text-sm">
              <TooltipProvider>
                {SOCIAL_APPS.filter((app) => app.id !== "github").map((app) => (
                  <Tooltip key={app.id}>
                    <TooltipTrigger>
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center transition-transform hover:scale-110"
                      >
                        <img
                          src={app.photoUrl}
                          alt={app.title}
                          className="size-4.5 object-contain opacity-70 transition-opacity group-hover:opacity-100"
                        />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs font-semibold">
                      <p>Follow on {app.title}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Right: Hotline & Auth */}
        <div className="flex items-center gap-3 text-[11px] sm:gap-4 sm:text-xs">
          <div className="hidden items-center gap-1.5 text-slate-300 xl:flex">
            <IconHeadset className="size-3.5 text-emerald-400" />
            <span>
              Hotline: <strong className="font-mono text-white">1900 8888</strong>
            </span>
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hidden text-slate-300 hover:text-emerald-400 sm:inline"
          >
            Help & Support
          </a>
          <span className="hidden text-slate-700 sm:inline">|</span>

          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            {resolvedTheme === "dark" ? (
              <IconSun className="size-3.5 text-amber-400" />
            ) : (
              <IconMoon className="size-3.5 text-slate-300" />
            )}
          </button>

          <span className="text-slate-700">|</span>

          <UserMenu />
        </div>
      </div>
    </div>
  )
}
