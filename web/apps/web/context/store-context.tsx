"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { PRODUCTS, type Product } from "@/lib/data"

export interface CartItem {
  product: Product
  quantity: number
  selectedVariant?: string
}

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type: "cart" | "wishlist" | "success" | "info"
}

interface DeliveryAddress {
  city: string
  district: string
  address: string
}

export interface UserProfile {
  name: string
  email: string
  avatar: string
  role: string
  ordersCount: number
  vouchersCount: number
}

interface StoreContextType {
  cart: CartItem[]
  addToCart: (
    product: Product,
    qty?: number,
    showToast?: boolean,
    variant?: string
  ) => void
  removeFromCart: (productId: string, variant?: string) => void
  updateQuantity: (
    productId: string,
    delta: number,
    variant?: string
  ) => void
  clearCart: () => void
  totalCartItems: number
  cartSubtotal: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void

  wishlist: string[]
  toggleWishlist: (product: Product) => void
  isWishlisted: (productId: string) => boolean
  wishlistCount: number

  deliveryAddress: DeliveryAddress
  setDeliveryAddress: (addr: DeliveryAddress) => void
  isDeliveryModalOpen: boolean
  setIsDeliveryModalOpen: (open: boolean) => void

  user: UserProfile | null
  login: (userData?: Partial<UserProfile>) => void
  logout: () => void
  isAuthModalOpen: boolean
  setIsAuthModalOpen: (open: boolean) => void

  checkoutProduct: Product | null
  setCheckoutProduct: (product: Product | null) => void

  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, "id">) => void
  removeToast: (id: string) => void

  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isRestored, setIsRestored] = useState(false)

  // Restore cart and wishlist from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ecome_cart")
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          setCart(parsed)
        }
      }
      const savedWishlist = localStorage.getItem("ecome_wishlist")
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist)
        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist)
        }
      }
    } catch (e) {
      console.error("Failed to restore cart from localStorage:", e)
    } finally {
      setIsRestored(true)
    }
  }, [])

  // Sync cart to localStorage whenever cart state changes
  useEffect(() => {
    if (!isRestored) return
    try {
      localStorage.setItem("ecome_cart", JSON.stringify(cart))
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e)
    }
  }, [cart, isRestored])

  // Sync wishlist to localStorage whenever wishlist changes
  useEffect(() => {
    if (!isRestored) return
    try {
      localStorage.setItem("ecome_wishlist", JSON.stringify(wishlist))
    } catch (e) {
      console.error("Failed to save wishlist to localStorage:", e)
    }
  }, [wishlist, isRestored])

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    city: "Hồ Chí Minh",
    district: "Quận 1, Bến Nghé",
    address: "Số 68 Nguyễn Huệ, Phường Bến Nghé",
  })

  // User Authentication State (Default: Realistic logged-in VIP user)
  const [user, setUser] = useState<UserProfile | null>({
    name: "Nguyễn Nam",
    email: "nam.nguyen@ecome.vn",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80&auto=format&fit=crop",
    role: "Thành viên VIP Kim Cương",
    ordersCount: 3,
    vouchersCount: 8,
  })
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const login = (userData?: Partial<UserProfile>) => {
    setUser({
      name: userData?.name || "Nguyễn Nam",
      email: userData?.email || "nam.nguyen@ecome.vn",
      avatar:
        userData?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80&auto=format&fit=crop",
      role: userData?.role || "Thành viên VIP Kim Cương",
      ordersCount: 3,
      vouchersCount: 8,
    })
    setIsAuthModalOpen(false)
    addToast({
      title: "Đăng nhập thành công!",
      message: `Chào mừng ${userData?.name || "Nguyễn Nam"} quay lại ECOME`,
      type: "success",
    })
  }

  const logout = () => {
    setUser(null)
    addToast({
      title: "Đã đăng xuất",
      message: "Bạn đã đăng xuất tài khoản an toàn",
      type: "info",
    })
  }

  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả danh mục")

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const addToCart = (
    product: Product,
    qty = 1,
    showToast = true,
    variant?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          (variant !== undefined
            ? (item.selectedVariant || "").trim() === variant.trim()
            : true)
      )
      if (existing) {
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      }
      return [
        ...prev,
        {
          product,
          quantity: qty,
          selectedVariant: variant,
        },
      ]
    })

    if (showToast) {
      addToast({
        title: "Đã thêm vào giỏ hàng!",
        message: `${qty > 1 ? `${qty}x ` : ""}${product.name.substring(0, 38)}...${
          variant ? ` (${variant})` : ""
        }`,
        type: "cart",
      })
    }
  }

  const removeFromCart = (productId: string, variant?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (item.product.id !== productId) return true
        if (variant !== undefined) {
          return (item.selectedVariant || "").trim() !== variant.trim()
        }
        return false
      })
    )
  }

  const updateQuantity = (
    productId: string,
    delta: number,
    variant?: string
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          const match =
            item.product.id === productId &&
            (variant !== undefined
              ? (item.selectedVariant || "").trim() === variant.trim()
              : true)
          if (match) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const clearCart = () => setCart([])

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.salePrice * item.quantity,
    0
  )

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.includes(product.id)
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== product.id))
      addToast({
        title: "Đã xoá khỏi mục Yêu thích",
        message: product.name.substring(0, 36) + "...",
        type: "wishlist",
      })
    } else {
      setWishlist((prev) => [...prev, product.id])
      addToast({
        title: "Đã lưu vào mục Yêu thích!",
        message: product.name.substring(0, 36) + "...",
        type: "wishlist",
      })
    }
  }

  const isWishlisted = (productId: string) => wishlist.includes(productId)
  const wishlistCount = wishlist.length

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCartItems,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount,
        deliveryAddress,
        setDeliveryAddress,
        isDeliveryModalOpen,
        setIsDeliveryModalOpen,
        user,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        checkoutProduct,
        setCheckoutProduct,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
