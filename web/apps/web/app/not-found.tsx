import Link from "next/link"
import { RouteFallback } from "@/components/route-fallback"

export default function NotFound() {
  return (
    <RouteFallback
      code="404"
      title="Page not found"
      description="The page may have moved or the address may be incorrect."
    >
      <Link href="/">Back to Home</Link>
    </RouteFallback>
  )
}
