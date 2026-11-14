import { useState, useRef, useEffect, type ReactNode } from "react"
import { IconChevronDown, IconCheck } from "@tabler/icons-react"

export interface SelectOption {
  value: string
  label: string
  icon?: ReactNode
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  triggerClassName?: string
  menuClassName?: string
  size?: "sm" | "md" | "lg"
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  triggerClassName = "",
  menuClassName = "",
  size = "md",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const sizeClasses = {
    sm: "h-8 px-2.5 text-xs rounded-lg",
    md: "h-10 px-3.5 text-xs sm:text-sm rounded-xl",
    lg: "h-11 px-4 text-sm rounded-xl",
  }[size]

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2.5 border border-slate-200 bg-white font-medium text-slate-800 shadow-xs transition hover:border-slate-300 hover:bg-slate-50/80 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 ${sizeClasses} ${
          isOpen ? "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-500" : ""
        } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <IconChevronDown
          className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-400 ${
            isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute top-full right-0 z-50 mt-1.5 min-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 dark:border-slate-800 dark:bg-slate-950 dark:shadow-2xl ${menuClassName}`}
        >
          <div className="max-h-60 space-y-0.5 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                    isSelected
                      ? "bg-emerald-50 font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span className="truncate">{option.label}</span>
                  </div>
                  {isSelected && (
                    <IconCheck className="ml-2 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
