import { useCallback, useEffect, useRef, useState } from "react"

export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    if (!isOpen || isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 150) // Khớp với thời gian animation-out
  }, [isOpen, isClosing])

  const toggle = useCallback(() => {
    if (isOpen) close()
    else setIsOpen(true)
  }, [isOpen, close])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close()
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close()
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, close])

  return { isOpen, isClosing, ref, toggle, close, setIsOpen }
}
