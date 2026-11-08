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
    name: "Tai nghe chống ồn không dây Sony WH-1000XM5 Hi-Res Audio",
    brand: "Sony Chính Hãng",
    category: "Âm thanh & Audio",
    originalPrice: 8990000,
    salePrice: 6790000,
    discountPercent: 24,
    rating: 4.9,
    reviewsCount: 1842,
    salesCount: "4.2k+",
    trustBadge: "Freeship Toàn Quốc",
    saleBadge: "-24% FLASH SALE",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao hỏa tốc 2H",
    description:
      "Khử tiếng ồn công nghệ cảm biến kép, âm thanh trung thực Hi-Res Audio không dây LDAC.",
    specs: [
      { label: "Thời lượng pin", value: "30 giờ" },
      { label: "Kết nối", value: "Bluetooth 5.2" },
    ],
  },
  {
    id: "ecome-apple-watch-s10",
    name: "Đồng hồ thông minh Apple Watch Series 10 Titanium 46mm GPS",
    brand: "Apple Authorised",
    category: "Thiết bị đeo",
    originalPrice: 18490000,
    salePrice: 15190000,
    discountPercent: 18,
    rating: 5.0,
    reviewsCount: 3410,
    salesCount: "1.8k+",
    trustBadge: "Freeship Hỏa Tốc",
    saleBadge: "-18% ƯU ĐÃI VIP",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao hôm nay",
    description:
      "Màn hình OLED góc rộng sáng nhất, vỏ Titanium cấp hàng không, sạc nhanh 80% trong 30 phút.",
    specs: [
      { label: "Chất liệu", value: "Titanium" },
      { label: "Kháng nước", value: "50m WR50" },
    ],
  },
  {
    id: "ecome-keychron-k3pro",
    name: "Bàn phím cơ không dây ECOME Keychron K3 Pro RGB Hot-Swap",
    brand: "ECOME Studio",
    category: "Công nghệ & Gaming",
    originalPrice: 2890000,
    salePrice: 2190000,
    discountPercent: 24,
    rating: 4.8,
    reviewsCount: 926,
    salesCount: "2.1k+",
    trustBadge: "Freeship Toàn Quốc",
    saleBadge: "TẶNG KÊ TAY",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao ngày mai",
    description:
      "Thiết kế Low-profile công thái học, switch Gateron hỗ trợ Hot-swap và phần mềm VIA tùy biến.",
    specs: [
      { label: "Switch", value: "Gateron Red/Brown" },
      { label: "Kết nối", value: "Type-C / BT 5.1" },
    ],
  },
  {
    id: "ecome-smart-thermos-850",
    name: "Bình giữ nhiệt thông minh ECOME Smart Thermos 850ml OLED",
    brand: "ECOME Life",
    category: "Gia dụng thông minh",
    originalPrice: 490000,
    salePrice: 329000,
    discountPercent: 33,
    rating: 4.9,
    reviewsCount: 5210,
    salesCount: "12.8k+",
    trustBadge: "Freeship Toàn Quốc",
    saleBadge: "TOP #1 BÁN CHẠY",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao hỏa tốc 2H",
    description:
      "Inox 316 chuẩn y tế, màn hình LED cảm ứng hiển thị nhiệt độ thực. Giữ nhiệt 24 giờ liên tục.",
    specs: [
      { label: "Dung tích", value: "850ml" },
      { label: "Vật liệu", value: "Inox 316" },
    ],
  },
  {
    id: "ecome-marshall-stanmore",
    name: "Loa Bluetooth Marshall Stanmore III Âm thanh vòm Stereo",
    brand: "Marshall Official",
    category: "Âm thanh & Audio",
    originalPrice: 11990000,
    salePrice: 9490000,
    discountPercent: 21,
    rating: 4.9,
    reviewsCount: 1120,
    salesCount: "950+",
    trustBadge: "Freeship Toàn Quốc",
    saleBadge: "-21% DEAL HOT",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao hỏa tốc 2H",
    description:
      "Âm trường rộng đặc trưng Marshall, công nghệ Placement Compensation cân chỉnh âm thanh phòng.",
    specs: [
      { label: "Công suất", value: "80W RMS" },
      { label: "Kết nối", value: "Bluetooth 5.2, AUX, RCA" },
    ],
  },
  {
    id: "ecome-logitech-mx-master3s",
    name: "Chuột không dây công thái học Logitech MX Master 3S Quiet Clicks",
    brand: "Logitech Official",
    category: "Công nghệ & Gaming",
    originalPrice: 2690000,
    salePrice: 2190000,
    discountPercent: 19,
    rating: 4.9,
    reviewsCount: 2310,
    salesCount: "5.6k+",
    trustBadge: "Freeship Toàn Quốc",
    saleBadge: "BEST SELLER",
    isFlashDeal: true,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao ngày mai",
    description:
      "Cảm biến 8000 DPI theo dõi trên kính, cuộn siêu nhanh MagSpeed, nhấp chuột êm ái giảm 90% tiếng ồn.",
    specs: [
      { label: "DPI", value: "200 - 8000 DPI" },
      { label: "Thời lượng pin", value: "70 ngày" },
    ],
  },
  {
    id: "ecome-ipad-air-m2",
    name: "Máy tính bảng Apple iPad Air M2 11-inch WiFi 128GB Chính Hãng",
    brand: "Apple Authorised",
    category: "Công nghệ & Gaming",
    originalPrice: 16990000,
    salePrice: 14790000,
    discountPercent: 13,
    rating: 4.9,
    reviewsCount: 840,
    salesCount: "1.5k+",
    trustBadge: "Freeship Toàn Quốc",
    saleBadge: "-13% TRẢ GÓP 0%",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao hôm nay",
    description:
      "Sức mạnh đột phá từ chip M2, màn hình Liquid Retina sắc nét, hỗ trợ Apple Pencil Pro và Magic Keyboard.",
    specs: [
      { label: "Chipset", value: "Apple M2 8-core" },
      { label: "Màn hình", value: "11-inch Liquid Retina" },
    ],
  },
  {
    id: "ecome-airpods-pro-2",
    name: "Tai nghe không dây Apple AirPods Pro Gen 2 MagSafe USB-C",
    brand: "Apple Authorised",
    category: "Âm thanh & Audio",
    originalPrice: 6190000,
    salePrice: 5190000,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 4120,
    salesCount: "8.9k+",
    trustBadge: "Freeship Toàn Quốc",
    saleBadge: "-16% DEAL SỐC",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao hỏa tốc 2H",
    description:
      "Chống ồn chủ động gấp 2 lần, chế độ thích ứng Adaptive Audio, chip H2 tái tạo âm thanh không gian.",
    specs: [
      { label: "Chống ồn", value: "Active Noise Cancellation" },
      { label: "Pin", value: "Tới 30 giờ kèm hộp sạc" },
    ],
  },
  {
    id: "ecome-camera-sony-a74",
    name: "Máy ảnh Mirrorless Sony Alpha A7 Mark IV Body 33MP 4K60p",
    brand: "Sony Alpha",
    category: "Công nghệ & Gaming",
    originalPrice: 59990000,
    salePrice: 52490000,
    discountPercent: 13,
    rating: 5.0,
    reviewsCount: 680,
    salesCount: "430+",
    trustBadge: "Freeship Hỏa Tốc",
    saleBadge: "TẶNG THẺ 128GB",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao hôm nay",
    description:
      "Cảm biến BSI Exmor R 33MP, bộ xử lý BIONZ XR, lấy nét tự động AI Real-time Eye AF.",
    specs: [
      { label: "Cảm biến", value: "Full-frame 33MP" },
      { label: "Quay phim", value: "4K 60p 10-bit 4:2:2" },
    ],
  },
  {
    id: "ecome-dell-ultrasharp-27",
    name: "Màn hình đồ họa chuyên nghiệp Dell UltraSharp 27 4K U2723QE IPS Black",
    brand: "Dell Technologies",
    category: "Công nghệ & Gaming",
    originalPrice: 15490000,
    salePrice: 13290000,
    discountPercent: 14,
    rating: 4.8,
    reviewsCount: 420,
    salesCount: "820+",
    trustBadge: "Freeship Hỏa Tốc",
    saleBadge: "BH 3 NĂM",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao ngày mai",
    description:
      "Công nghệ IPS Black đầu tiên trên thế giới cho tỷ lệ tương phản 2000:1, độ phủ 100% sRGB và 98% DCI-P3.",
    specs: [
      { label: "Độ phân giải", value: "4K UHD (3840 x 2160)" },
      { label: "Tấm nền", value: "IPS Black 27 inch" },
    ],
  },
  {
    id: "ecome-garmin-fenix-7",
    name: "Đồng hồ thể thao GPS Garmin Fenix 7 Pro Solar Sapphire Chống Nước",
    brand: "Garmin Official",
    category: "Thiết bị đeo",
    originalPrice: 23990000,
    salePrice: 19990000,
    discountPercent: 17,
    rating: 4.8,
    reviewsCount: 380,
    salesCount: "620+",
    trustBadge: "Freeship Toàn Quốc",
    saleBadge: "PIN 22 NGÀY",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao hôm nay",
    description:
      "Sạc năng lượng mặt trời Power Sapphire, đèn pin LED tích hợp, đo nhịp tim thế hệ 5 Gen 5 và bản đồ Topo đa lục địa.",
    specs: [
      { label: "Thời lượng pin", value: "Tới 22 ngày với Solar" },
      { label: "Kháng nước", value: "10 ATM (100m)" },
    ],
  },
  {
    id: "ecome-dyson-v12-vacuum",
    name: "Máy hút bụi không dây thông minh Dyson V12 Detect Slim Total Clean",
    brand: "Dyson Official",
    category: "Gia dụng thông minh",
    originalPrice: 19990000,
    salePrice: 16890000,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 510,
    salesCount: "740+",
    trustBadge: "Freeship Hỏa Tốc",
    saleBadge: "TẶNG PHỤ KIỆN",
    isFlashDeal: false,
    image:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80&auto=format&fit=crop",
    inStock: true,
    deliveryEstimate: "Giao ngày mai",
    description:
      "Tia laser phát hiện bụi vi mô vô hình, cảm biến Piezo đo kích thước hạt bụi, lực hút mạnh mẽ 150 AW.",
    specs: [
      { label: "Lực hút", value: "150 AW" },
      { label: "Trọng lượng", value: "2.2 kg siêu nhẹ" },
    ],
  },
]

export const DESIGN_TOKENS: DesignToken[] = [
  {
    name: "Header & Brand Base",
    cssVar: "--brand-header",
    lightValue: "#0F172A",
    darkValue: "#020617",
    category: "brand",
    description:
      "Slate tối chuyên nghiệp, tạo chiều sâu thị giác và tăng độ tập trung cho sản phẩm.",
  },
  {
    name: "Page Surface (Trắng tinh khiết)",
    cssVar: "--surface-white",
    lightValue: "#FFFFFF",
    darkValue: "#0F172A",
    category: "surface",
    description: "Nền trắng sạch sẽ, nổi bật hình ảnh sản phẩm và nội dung.",
  },
  {
    name: "Subtle Surface (Xám nhẹ)",
    cssVar: "--surface-light",
    lightValue: "#F8FAFC",
    darkValue: "#1E293B",
    category: "surface",
    description: "Slate 50 phân định khối mềm mại giữa các khối sản phẩm.",
  },
  {
    name: "Primary Action / CTA (Mua Ngay)",
    cssVar: "--primary-emerald",
    lightValue: "#059669",
    darkValue: "#10B981",
    category: "action",
    description:
      "Emerald Green kích thích thanh toán an toàn, tăng tỷ lệ hoàn tất đơn hàng.",
  },
  {
    name: "Secondary Action (Thêm Vào Giỏ)",
    cssVar: "--secondary-emerald-border",
    lightValue: "#059669",
    darkValue: "#10B981",
    category: "action",
    description:
      "Viền mỏng Emerald trên nền trắng, phân cấp rõ ràng với nút Mua Ngay.",
  },
  {
    name: "Trust / Freeship Badge",
    cssVar: "--badge-trust-bg",
    lightValue: "#ECFDF5",
    darkValue: "rgba(6, 78, 59, 0.4)",
    category: "badge",
    description:
      "Emerald nhạt kèm viền Emerald 200, truyền tải Freeship và Chính hãng.",
  },
  {
    name: "Sale / Promotion Badge",
    cssVar: "--badge-sale-bg",
    lightValue: "#2563EB",
    darkValue: "#3B82F6",
    category: "badge",
    description:
      "Xanh Cobalt/Royal Blue nổi bật ưu đãi giảm giá mà không gây chói mắt.",
  },
  {
    name: "Rating Stars",
    cssVar: "--rating-amber",
    lightValue: "#F59E0B",
    darkValue: "#FBBF24",
    category: "rating",
    description: "Vàng hổ phách dịu Amber 500 cho số sao đánh giá uy tín.",
  },
]

export const CATEGORIES = [
  "Tất cả danh mục",
  "Âm thanh & Audio",
  "Công nghệ & Gaming",
  "Thiết bị đeo",
  "Gia dụng thông minh",
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
