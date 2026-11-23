import type { ReactNode } from "react"
import styles from "./route-fallback.module.css"

export function RouteFallback({
  code,
  title,
  description,
  children,
}: {
  code?: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        {code && <p className={styles.code}>{code}</p>}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          {children}
        </div>
      </div>
    </main>
  )
}
