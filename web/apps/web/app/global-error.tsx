"use client"

import styles from "@/components/route-fallback.module.css"
import { RouteError, type RouteErrorProps } from "@/components/route-error"

export default function GlobalError(props: RouteErrorProps) {
  return (
    <html lang="en">
      <body className={styles.document}>
        <title>Something went wrong | ECOME</title>
        <RouteError {...props} />
      </body>
    </html>
  )
}
