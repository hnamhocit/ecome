"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import styles from "./navigation-progress.module.css"

const revealDelay = 150
const finishDuration = 200
const navigationTimeout = 30_000

export function NavigationProgress() {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const location = search ? `${pathname}?${search}` : pathname
  const committedLocation = useRef(location)
  const finishNavigation = useRef<(() => void) | null>(null)
  const [phase, setPhase] = useState<"idle" | "pending" | "finishing">("idle")

  useEffect(() => {
    committedLocation.current = location
    finishNavigation.current?.()
  }, [location])

  useEffect(() => {
    let active = false
    let visible = false
    let reveal: number
    let timeout: number
    let hide: number

    function finish() {
      if (!active) return

      active = false
      window.clearTimeout(reveal)
      window.clearTimeout(timeout)
      if (!visible) return

      visible = false
      setPhase("finishing")
      hide = window.setTimeout(() => setPhase("idle"), finishDuration)
    }

    function start(event: Event) {
      const destination = new URL((event as CustomEvent<string>).detail, window.location.href)
      const query = destination.searchParams.toString()
      const target = query ? `${destination.pathname}?${query}` : destination.pathname
      if (destination.origin !== window.location.origin) return
      if (target === committedLocation.current) {
        finish()
        return
      }

      window.clearTimeout(timeout)
      timeout = window.setTimeout(finish, navigationTimeout)
      if (active) return

      active = true
      window.clearTimeout(hide)
      setPhase("idle")
      reveal = window.setTimeout(() => {
        visible = true
        setPhase("pending")
      }, revealDelay)
    }

    finishNavigation.current = finish
    window.addEventListener("ecome:navigation-start", start)
    return () => {
      finishNavigation.current = null
      window.removeEventListener("ecome:navigation-start", start)
      window.clearTimeout(reveal)
      window.clearTimeout(timeout)
      window.clearTimeout(hide)
    }
  }, [])

  return <div aria-hidden="true" className={styles.bar} data-phase={phase} />
}
