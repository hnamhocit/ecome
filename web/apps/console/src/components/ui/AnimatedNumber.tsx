import { useEffect, useState, useRef } from "react"

interface AnimatedNumberProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

// Ease out cubic with slight spring overshoot for the Twitter/X feel
function easeOutSpring(t: number): number {
  const c4 = (2 * Math.PI) / 3
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1200,
  className = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const prevValueRef = useRef(0)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const startValue = prevValueRef.current
    const endValue = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Use spring easing for a lively count up
      const easeProgress = easeOutSpring(progress)
      const current = startValue + (endValue - startValue) * easeProgress

      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
        prevValueRef.current = endValue
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  const formatted = displayValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span className={`inline-flex items-baseline font-mono tabular-nums ${className}`}>
      {prefix && <span>{prefix}</span>}
      <span>{formatted}</span>
      {suffix && <span className="ml-1.5 font-sans font-medium text-slate-500 dark:text-slate-400">{suffix.trim()}</span>}
    </span>
  )
}

/**
 * Rolling ticker digit component modeled after Twitter/X's like counter:
 * Digits roll vertically upwards when transitioning.
 */
export function RollingTicker({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: string | number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const str = String(value)

  return (
    <span className={`inline-flex items-center font-mono tabular-nums ${className}`}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <span className="inline-flex overflow-hidden">
        {str.split("").map((char, index) => {
          if (!/\d/.test(char)) {
            return (
              <span key={`non-digit-${index}`} className="px-0.25">
                {char}
              </span>
            )
          }

          const digit = parseInt(char, 10)

          return (
            <span
              key={`digit-${index}-${char}`}
              className="relative inline-block h-[1.15em] w-[0.62em] overflow-hidden"
            >
              <span
                className="absolute top-0 left-0 flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{
                  transform: `translateY(-${digit * 10}%)`,
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <span
                    key={n}
                    className="flex h-[1.15em] items-center justify-center leading-none"
                  >
                    {n}
                  </span>
                ))}
              </span>
            </span>
          )
        })}
      </span>
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  )
}
