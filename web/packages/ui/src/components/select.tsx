"use client"

import * as React from "react"
import { cn } from "cn"

export interface SelectOption {
  value: string
  label: string
  icon?: string
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  triggerClassName?: string
  menuClassName?: string
  size?: "sm" | "default" | "lg"
  align?: "left" | "right"
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Chọn...",
  className,
  triggerClassName,
  menuClassName,
  size = "default",
  align = "right",
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const handleClose = React.useCallback(() => {
    if (!isOpen || isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 150)
  }, [isOpen, isClosing])

  const handleToggle = () => {
    if (isOpen) {
      handleClose()
    } else {
      setIsOpen(true)
    }
  }

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (isOpen) handleClose()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        handleClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleClose])

  const sizeStyles = {
    sm: "h-8 px-2.5 text-xs rounded-md",
    default: "h-9.5 px-3 text-xs sm:text-sm rounded-lg",
    lg: "h-11 px-4 text-sm sm:text-base rounded-lg",
  }[size]

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-left", className)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className={cn(
          "flex items-center justify-between gap-2 border border-border bg-card text-foreground shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-muted/50 focus:ring-2 focus:ring-ring/40 focus:outline-none",
          sizeStyles,
          isOpen && "border-primary ring-2 ring-primary/40",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-1.5 truncate">
          {selectedOption?.icon && (
            <i className={cn("text-sm", selectedOption.icon)} />
          )}
          <span className="truncate font-semibold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <i
          className={cn(
            "ti ti-chevron-down text-xs text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Animated Dropdown Menu with BOTH Entrance and Exit Keyframe Animations */}
      {(isOpen || isClosing) && (
        <div
          role="listbox"
          className={cn(
            "absolute top-full z-50 mt-1.5 max-w-[320px] min-w-[200px] overflow-hidden rounded-xl border border-border bg-card p-1 shadow-2xl",
            align === "right" ? "right-0" : "left-0",
            isOpen && !isClosing
              ? "animate-dropdown-in"
              : "animate-dropdown-out pointer-events-none",
            menuClassName
          )}
        >
          <div className="max-h-64 space-y-0.5 overflow-y-auto py-0.5">
            {options.map((option) => {
              const isSelected = option.value === value

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onValueChange(option.value)
                    handleClose()
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors sm:text-sm",
                    isSelected
                      ? "bg-primary font-bold text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.icon && (
                      <i className={cn("text-sm", option.icon)} />
                    )}
                    <span className="truncate">{option.label}</span>
                  </div>
                  {isSelected && (
                    <i className="ti ti-check ml-2 shrink-0 text-sm" />
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
