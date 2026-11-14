export interface Product {
  id: string
  name: string
  brand: string
  category: string
  originalPrice: number
  salePrice: number
  discountPercent: number
  rating: number
  reviewsCount: number
  salesCount: string
  trustBadge: string
  saleBadge?: string
  image: string
  images?: string[]
  colors?: { name: string; hex: string; inStock?: boolean; stock?: number }[]
  inStock: boolean
  deliveryEstimate: string
  description: string
  specs: { label: string; value: string }[]
  highlights?: string[]
  isFlashDeal?: boolean
}

export interface DesignToken {
  name: string
  cssVar: string
  lightValue: string
  darkValue: string
  category: "brand" | "action" | "badge" | "rating" | "surface"
  description: string
  contrastNote?: string
}

export const PRODUCTS: Product[] = [
  {
    id: "ecome-sony-wh1000xm5",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones - Hi-Res Audio",
    brand: "Sony Official",
    category: "Audio & Acoustics",
    originalPrice: 8490000,
    salePrice: 6490000,
    discountPercent: 24,
    rating: 4.9,
    reviewsCount: 1240,
    salesCount: "2.8k+",
    trustBadge: "Free Shipping",
    saleBadge: "FLASH SALE",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Delivers Tomorrow",
    description:
      "Industry-leading noise cancellation with two processors and 8 microphones. Up to 30 hours of battery life with quick charge.",
    specs: [
      { label: "Battery Life", value: "30 Hours (ANC On)" },
      { label: "Driver Unit", value: "30mm Carbon Fiber" },
      { label: "Bluetooth", value: "v5.2, LDAC, AAC, SBC" },
    ],
  },
  {
    id: "ecome-keychron-k3-pro",
    name: "Keychron K3 Pro Ultra-Slim Wireless Custom Mechanical Keyboard (QMK/VIA)",
    brand: "Keychron Official",
    category: "Computers & Gaming",
    originalPrice: 2890000,
    salePrice: 2290000,
    discountPercent: 21,
    rating: 4.8,
    reviewsCount: 680,
    salesCount: "1.5k+",
    trustBadge: "Official Warranty 12M",
    saleBadge: "HOT DEAL",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "2H Express",
    description:
      "Ultra-slim mechanical keyboard supporting QMK/VIA key remapping, compatible with Mac and Windows.",
    specs: [
      { label: "Layout", value: "75% Compact (84 keys)" },
      { label: "Switch", value: "Gateron Low Profile Mechanical" },
    ],
  },
  {
    id: "ecome-apple-watch-s10",
    name: "Apple Watch Series 10 GPS 46mm Aluminum Case with Sport Band",
    brand: "Apple Authorised",
    category: "Wearables",
    originalPrice: 11990000,
    salePrice: 10490000,
    discountPercent: 13,
    rating: 4.9,
    reviewsCount: 920,
    salesCount: "3.1k+",
    trustBadge: "100% Genuine",
    saleBadge: "NEW ARRIVAL",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Delivers Today",
    description:
      "Thinnest Apple Watch ever with the biggest display, advanced health tracking, and fast charging.",
    specs: [
      { label: "Display", value: "Wide-Angle OLED Always-On" },
      { label: "Chipset", value: "Apple S10 SiP 64-bit dual-core" },
    ],
  },
  {
    id: "ecome-marshall-emberton-2",
    name: "Marshall Emberton II Portable Bluetooth Speaker - 30+ Hours Playtime",
    brand: "Marshall Official",
    category: "Audio & Acoustics",
    originalPrice: 4990000,
    salePrice: 3890000,
    discountPercent: 22,
    rating: 4.9,
    reviewsCount: 1540,
    salesCount: "4.2k+",
    trustBadge: "Free Shipping",
    saleBadge: "TOP SELLER",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Delivers Tomorrow",
    description:
      "Iconic Marshall design with True Stereophonic multi-directional sound and IP67 dust and water resistance.",
    specs: [
      { label: "Frequency Range", value: "60 Hz - 20 kHz" },
      { label: "Water Resistance", value: "IP67 Waterproof" },
    ],
  },
  {
    id: "ecome-logitech-mx-master-3s",
    name: "Logitech MX Master 3S Wireless Performance Mouse 8K DPI Quiet Clicks",
    brand: "Logitech Official",
    category: "Computers & Gaming",
    originalPrice: 2690000,
    salePrice: 1990000,
    discountPercent: 26,
    rating: 4.9,
    reviewsCount: 2100,
    salesCount: "5.6k+",
    trustBadge: "Official Warranty 24M",
    saleBadge: "SUPER DEAL",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "2H Express",
    description:
      "MagSpeed electromagnetic scroll wheel, 8,000 DPI track-on-glass optical sensor, and Quiet Click buttons.",
    specs: [
      { label: "Sensor DPI", value: "200 to 8000 DPI" },
      { label: "Connectivity", value: "Bluetooth & Logi Bolt USB" },
    ],
  },
  {
    id: "ecome-fujifilm-x-t50",
    name: "Fujifilm X-T50 Mirrorless Digital Camera with XC 15-45mm Lens Kit",
    brand: "Fujifilm Official",
    category: "Computers & Gaming",
    originalPrice: 37990000,
    salePrice: 33490000,
    discountPercent: 12,
    rating: 4.8,
    reviewsCount: 420,
    salesCount: "890+",
    trustBadge: "Authentic Guarantee",
    saleBadge: "EXCLUSIVE",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Delivers Today",
    description:
      "40.2MP X-Trans CMOS 5 HR sensor, dedicated Film Simulation dial, 6.2K/30p video recording, and 5-axis IBIS.",
    specs: [
      { label: "Sensor", value: "40.2 MP APS-C X-Trans CMOS 5 HR" },
      { label: "Video", value: "6.2K 30fps 10-bit 4:2:2" },
    ],
  },
  {
    id: "ecome-dell-ultrasharp-u2724de",
    name: "Dell UltraSharp 27-inch 4K Thunderbolt 4 USB-C Hub Monitor (U2724DE)",
    brand: "Dell Official",
    category: "Computers & Gaming",
    originalPrice: 15490000,
    salePrice: 13290000,
    discountPercent: 14,
    rating: 4.9,
    reviewsCount: 760,
    salesCount: "1.2k+",
    trustBadge: "Exchange in 30 Days",
    saleBadge: "BEST FOR PROS",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Delivers Tomorrow",
    description:
      "IPS Black technology with 2000:1 contrast ratio, 120Hz refresh rate, 90W USB-C Power Delivery, and RJ45 ethernet.",
    specs: [
      { label: "Resolution", value: "4K UHD (3840 x 2160)" },
      { label: "Panel", value: "IPS Black 27 inch 120Hz" },
    ],
  },
  {
    id: "ecome-garmin-fenix-7",
    name: "Garmin Fenix 7 Pro Solar Sapphire Edition Multisport GPS Smartwatch",
    brand: "Garmin Official",
    category: "Wearables",
    originalPrice: 23990000,
    salePrice: 19990000,
    discountPercent: 17,
    rating: 4.8,
    reviewsCount: 380,
    salesCount: "620+",
    trustBadge: "Free Shipping",
    saleBadge: "22-DAY BATTERY",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Delivers Today",
    description:
      "Solar charging Power Sapphire lens, built-in LED flashlight, Gen 5 heart rate sensor, and multi-continent Topo maps.",
    specs: [
      { label: "Battery Life", value: "Up to 22 Days with Solar" },
      { label: "Water Rating", value: "10 ATM (100m)" },
    ],
  },
  {
    id: "ecome-dyson-v12-vacuum",
    name: "Dyson V12 Detect Slim Total Clean Cordless Vacuum Cleaner",
    brand: "Dyson Official",
    category: "Smart Home",
    originalPrice: 19990000,
    salePrice: 16890000,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 510,
    salesCount: "740+",
    trustBadge: "Express Shipping",
    saleBadge: "FREE ACCESSORIES",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Delivers Tomorrow",
    description:
      "Illuminating cleaner head reveals microscopic dust. Piezo sensor measures and counts dust particles automatically.",
    specs: [
      { label: "Suction Power", value: "150 AW" },
      { label: "Weight", value: "2.2 kg ultra lightweight" },
    ],
  },
]

export const CATEGORIES = [
  "All Categories",
  "Audio & Acoustics",
  "Computers & Gaming",
  "Wearables",
  "Smart Home",
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getRelatedProducts(product: Product, limit = 6): Product[] {
  const sameCategory = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  )
  const otherCategory = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category !== product.category
  )
  return [...sameCategory, ...otherCategory].slice(0, limit)
}
