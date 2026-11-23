"use client"

import { useEffect } from "react"
import { RouteFallback } from "@/components/route-fallback"

export interface RouteErrorProps {
  error: Error & { digest?: string }
  retry: () => void
}

export function RouteError({ error, retry }: RouteErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <RouteFallback
      title="Something went wrong"
      description="Try loading this page again."
    >
      <button type="button" onClick={retry}>
        Try Again
      </button>
      <a href="/">Back to Home</a>
    </RouteFallback>
  )
}
