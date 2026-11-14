import { useState } from "react"
import {
  IconTrendingUp,
  IconCurrencyDollar,
  IconShoppingCart,
  IconUsers,
  IconDownload,
  IconPlus,
  IconArrowUpRight,
  IconChartBar,
  IconChartPie,
  IconServer,
  IconActivity,
  IconReceiptTax,
  IconBrandMeta,
  IconBrandGoogle,
  IconBrandTiktok,
  IconCheck,
  IconAlertCircle,
  IconClockCheck,
  IconCoin,
  IconSparkles,
  IconBriefcase,
  IconHeartHandshake,
} from "@tabler/icons-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { AnimatedNumber } from "../components/ui/AnimatedNumber"

// Overview Revenue Trend Data
const REVENUE_DATA_7D = [
  { date: "Mon", revenue: 4200, orders: 120 },
  { date: "Tue", revenue: 5100, orders: 145 },
  { date: "Wed", revenue: 4800, orders: 132 },
  { date: "Thu", revenue: 6400, orders: 180 },
  { date: "Fri", revenue: 7800, orders: 210 },
  { date: "Sat", revenue: 9500, orders: 270 },
  { date: "Sun", revenue: 8900, orders: 250 },
]

const REVENUE_DATA_30D = [
  { date: "Nov 01", revenue: 12400, orders: 340 },
  { date: "Nov 05", revenue: 16800, orders: 460 },
  { date: "Nov 10", revenue: 14200, orders: 390 },
  { date: "Nov 15", revenue: 21500, orders: 580 },
  { date: "Nov 20", revenue: 28400, orders: 740 },
  { date: "Nov 25", revenue: 36200, orders: 960 },
  { date: "Nov 30", revenue: 48920, orders: 1428 },
]

const REVENUE_DATA_12M = [
  { date: "Jan", revenue: 28000, orders: 820 },
  { date: "Feb", revenue: 32000, orders: 940 },
  { date: "Mar", revenue: 36500, orders: 1050 },
  { date: "Apr", revenue: 34000, orders: 980 },
  { date: "May", revenue: 41000, orders: 1200 },
  { date: "Jun", revenue: 45000, orders: 1310 },
  { date: "Jul", revenue: 43200, orders: 1250 },
  { date: "Aug", revenue: 47800, orders: 1390 },
  { date: "Sep", revenue: 46100, orders: 1340 },
  { date: "Oct", revenue: 52000, orders: 1520 },
  { date: "Nov", revenue: 58900, orders: 1680 },
  { date: "Dec", revenue: 64200, orders: 1850 },
]

// Active Shopper Growth & Retention Data (30 Days)
const SHOPPER_GROWTH_DATA = [
  { date: "Nov 01", totalActive: 2450, newShoppers: 680, returningShoppers: 1770 },
  { date: "Nov 05", totalActive: 2780, newShoppers: 790, returningShoppers: 1990 },
  { date: "Nov 10", totalActive: 2920, newShoppers: 840, returningShoppers: 2080 },
  { date: "Nov 15", totalActive: 3180, newShoppers: 950, returningShoppers: 2230 },
  { date: "Nov 20", totalActive: 3450, newShoppers: 1080, returningShoppers: 2370 },
  { date: "Nov 25", totalActive: 3720, newShoppers: 1210, returningShoppers: 2510 },
  { date: "Nov 30", totalActive: 3890, newShoppers: 1320, returningShoppers: 2570 },
]

// Staff & Team Department Breakdown
const STAFF_DEPARTMENTS = [
  { dept: "Fulfillment & 2H Logistics", count: 8, payroll: "$6,400", lead: "Tran Minh Tuan", status: "Optimal" },
  { dept: "Store Operations & Catalog", count: 5, payroll: "$4,100", lead: "Elena Rostova", status: "Optimal" },
  { dept: "Customer Care & Support", count: 3, payroll: "$2,250", lead: "Sarah Jenkins", status: "Active" },
  { dept: "Security & Store Admin", count: 2, payroll: "$1,500", lead: "Nguyen Hoang Nam", status: "Admin" },
]

// Category Breakdown Data
const CATEGORY_DATA = [
  { name: "Audio & Acoustics", value: 42, color: "#10b981", amount: "$20,546" },
  { name: "Keyboards & Typing", value: 24, color: "#3b82f6", amount: "$11,740" },
  { name: "Wearables & Tech", value: 18, color: "#8b5cf6", amount: "$8,805" },
  { name: "Accessories", value: 16, color: "#f59e0b", amount: "$7,829" },
]


// System Health Latency Percentiles Data (24 Hours)
const LATENCY_PERCENTILES_DATA = [
  { time: "00:00", p50: 18, p95: 52, p99: 110 },
  { time: "03:00", p50: 16, p95: 48, p99: 98 },
  { time: "06:00", p50: 20, p95: 56, p99: 124 },
  { time: "09:00", p50: 25, p95: 74, p99: 162 },
  { time: "12:00", p50: 28, p95: 82, p99: 185 },
  { time: "15:00", p50: 24, p95: 70, p99: 154 },
  { time: "18:00", p50: 29, p95: 88, p99: 198 },
  { time: "20:00", p50: 32, p95: 96, p99: 215 },
  { time: "22:00", p50: 22, p95: 68, p99: 148 },
]

// System Microservices Status
const SYSTEM_SERVICES = [
  { name: "Auth & User Identity API", latency: "18 ms", status: "Healthy", uptime: "99.99%" },
  { name: "Catalog Search & Indexing", latency: "26 ms", status: "Healthy", uptime: "99.98%" },
  { name: "Cart & Checkout Engine", latency: "34 ms", status: "Healthy", uptime: "99.97%" },
  { name: "VietQR & Payment Webhooks", latency: "72 ms", status: "Healthy", uptime: "99.95%" },
  { name: "Cloud CDN & Edge Delivery", latency: "12 ms", status: "Healthy", uptime: "100.0%" },
]

// Expenses & Advertising Data
const AD_SPEND_CHANNELS = [
  { name: "Meta Ads (FB & IG)", amount: 1850, percentage: 38.1, roas: "11.2x", icon: IconBrandMeta, color: "#1877f2" },
  { name: "Google Shopping & Search", amount: 1420, percentage: 29.3, roas: "9.8x", icon: IconBrandGoogle, color: "#ea4335" },
  { name: "TikTok Creator Spark Ads", amount: 980, percentage: 20.2, roas: "8.9x", icon: IconBrandTiktok, color: "#000000" },
  { name: "ECOME Sponsored Slots", amount: 600, percentage: 12.4, roas: "12.4x", icon: IconSparkles, color: "#10b981" },
]

const DAILY_FINANCIAL_FLOW = [
  { day: "Mon", gross: 4200, adSpend: 650, eventCost: 400, net: 3150 },
  { day: "Tue", gross: 5100, adSpend: 700, eventCost: 450, net: 3950 },
  { day: "Wed", gross: 4800, adSpend: 620, eventCost: 380, net: 3800 },
  { day: "Thu", gross: 6400, adSpend: 780, eventCost: 520, net: 5100 },
  { day: "Fri", gross: 7800, adSpend: 920, eventCost: 650, net: 6230 },
  { day: "Sat", gross: 9500, adSpend: 1100, eventCost: 820, net: 7580 },
  { day: "Sun", gross: 8900, adSpend: 1080, eventCost: 750, net: 7070 },
]

const CAMPAIGN_EVENTS = [
  {
    name: "Black Friday Mega Tech Sale",
    discountSubsidy: "$1,400.00",
    revenueGenerated: "$18,400.00",
    roas: "13.1x",
    orders: 492,
    status: "Active",
  },
  {
    name: "Super Audio Weekend",
    discountSubsidy: "$740.00",
    revenueGenerated: "$9,800.00",
    roas: "13.2x",
    orders: 260,
    status: "Active",
  },
  {
    name: "Free 2H Express Delivery Subsidies",
    discountSubsidy: "$1,280.00",
    revenueGenerated: "$14,500.00",
    roas: "11.3x",
    orders: 480,
    status: "Completed",
  },
]

const RECENT_ORDERS = [
  {
    id: "ECM-9824",
    customer: "Alex Morgan",
    product: "Sony WH-1000XM5 Headphones",
    amount: "$259.00",
    status: "Delivered",
    date: "10 mins ago",
  },
  {
    id: "ECM-9823",
    customer: "Elena Rostova",
    product: "Keychron K3 Pro Wireless",
    amount: "$92.00",
    status: "Processing",
    date: "45 mins ago",
  },
  {
    id: "ECM-9822",
    customer: "Marcus Vance",
    product: "Apple Watch Series 10",
    amount: "$420.00",
    status: "Shipped",
    date: "2 hours ago",
  },
  {
    id: "ECM-9821",
    customer: "Sarah Jenkins",
    product: "Marshall Emberton II Speaker",
    amount: "$155.00",
    status: "Delivered",
    date: "4 hours ago",
  },
  {
    id: "ECM-9820",
    customer: "David Chen",
    product: "Logitech MX Master 3S",
    amount: "$80.00",
    status: "Pending",
    date: "6 hours ago",
  },
]

type DashboardTab = "overview" | "marketing-expenses" | "system-health"

export function DashboardView() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview")
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "12M">("30D")

  const revenueData =
    timeRange === "7D"
      ? REVENUE_DATA_7D
      : timeRange === "30D"
      ? REVENUE_DATA_30D
      : REVENUE_DATA_12M

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Operations & Seller Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time analytics, revenue trajectory, payroll overhead, and active shopper growth.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100/90 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <IconDownload className="size-4" />
            <span>Export Report</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 active:scale-95"
          >
            <IconPlus className="size-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Clean Borderless Segmented Pill Bar */}
      <div className="inline-flex flex-wrap items-center rounded-2xl bg-slate-100/80 p-1 dark:bg-slate-900/90">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "overview"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <IconChartBar className="size-4 text-emerald-500" />
          <span>Sales & Operations Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("marketing-expenses")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "marketing-expenses"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <IconReceiptTax className="size-4 text-blue-500" />
          <span>Marketing & Ad Spend</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
            ROAS 10.1x
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("system-health")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "system-health"
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          <IconServer className="size-4 text-purple-500" />
          <span>System Health & SLA</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            99.98%
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW (Revenue, Net Profit, Staff & Payroll, Active Shoppers Chart) */}
      {/* ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 6 Clean Metric Cards with Spring Count-Up Numbers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* 1. Gross Revenue */}
            <div className="rounded-2xl bg-white p-5 shadow-xs transition hover:shadow-md dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Gross Revenue
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <IconCurrencyDollar className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  <AnimatedNumber value={48920} prefix="$" decimals={2} duration={1200} />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <IconTrendingUp className="size-3" />
                  <span>+14.8% vs last month</span>
                </div>
              </div>
            </div>

            {/* 2. Total Net Profit */}
            <div className="rounded-2xl bg-white p-5 shadow-xs transition hover:shadow-md dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Total Net Profit
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <IconCoin className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="font-heading text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  <AnimatedNumber value={25246} prefix="$" decimals={2} duration={1300} />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span>51.6% net margin</span>
                </div>
              </div>
            </div>

            {/* 3. Completed Orders */}
            <div className="rounded-2xl bg-white p-5 shadow-xs transition hover:shadow-md dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Total Orders
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                  <IconShoppingCart className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  <AnimatedNumber value={1428} decimals={0} duration={1100} />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <IconTrendingUp className="size-3" />
                  <span>+8.2% fulfillment rate</span>
                </div>
              </div>
            </div>

            {/* 4. Active Shoppers */}
            <div className="rounded-2xl bg-white p-5 shadow-xs transition hover:shadow-md dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Active Shoppers
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                  <IconUsers className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  <AnimatedNumber value={3890} decimals={0} duration={1200} />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <IconTrendingUp className="size-3" />
                  <span>+12.1% repeat buyers</span>
                </div>
              </div>
            </div>

            {/* 5. Staff Headcount */}
            <div className="rounded-2xl bg-white p-5 shadow-xs transition hover:shadow-md dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Staff & Headcount
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                  <IconBriefcase className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  <AnimatedNumber value={18} suffix=" Staff" decimals={0} duration={900} />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <span>4 core departments</span>
                </div>
              </div>
            </div>

            {/* 6. Total Monthly Payroll */}
            <div className="rounded-2xl bg-white p-5 shadow-xs transition hover:shadow-md dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Monthly Payroll
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400">
                  <IconHeartHandshake className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  <AnimatedNumber value={14250} prefix="$" decimals={2} duration={1200} />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <span>Avg $790 / employee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Row: Active Shopper Chart & Revenue Trajectory */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Active Shoppers Growth Chart (Dedicated as requested) */}
            <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900/80">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <IconUsers className="size-5 text-purple-600 dark:text-purple-400" />
                    <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                      Active Shoppers & Buyer Growth
                    </h2>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Trajectory of daily active shoppers with new vs. repeat buyer retention.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                    <span className="size-2 rounded-full bg-purple-500" />
                    Returning (66%)
                  </span>
                  <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                    <span className="size-2 rounded-full bg-teal-500" />
                    New Buyers
                  </span>
                </div>
              </div>

              <div className="mt-6 h-68 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SHOPPER_GROWTH_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="returningGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0", opacity: 0.2 }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${val}`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]?.payload
                          return (
                            <div className="rounded-xl bg-white/95 p-3 shadow-xl backdrop-blur-md dark:bg-slate-950/95">
                              <p className="text-xs font-bold text-slate-500">{label}</p>
                              <p className="font-heading text-lg font-black text-slate-900 dark:text-white">
                                {data.totalActive.toLocaleString()} Total Shoppers
                              </p>
                              <div className="mt-1 space-y-0.5 text-xs">
                                <p className="font-bold text-purple-600 dark:text-purple-400">
                                  Repeat Buyers: {data.returningShoppers.toLocaleString()}
                                </p>
                                <p className="font-bold text-teal-600 dark:text-teal-400">
                                  New First-Time: {data.newShoppers.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="returningShoppers"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#returningGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="newShoppers"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#newGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Shopper Retention Metrics */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <div className="text-center">
                  <span className="text-[11px] text-slate-400">Repeat Purchase</span>
                  <p className="font-heading text-base font-black text-slate-900 dark:text-white">
                    66.1%
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-[11px] text-slate-400">Acquisition Cost (CAC)</span>
                  <p className="font-heading text-base font-black text-emerald-600 dark:text-emerald-400">
                    $3.67
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-[11px] text-slate-400">Customer LTV</span>
                  <p className="font-heading text-base font-black text-slate-900 dark:text-white">
                    $142.00
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Trajectory Area Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900/80">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <IconChartBar className="size-5 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                      Revenue Trajectory & Sales Volume
                    </h2>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Gross sales over time with projected order fulfillment volume.
                  </p>
                </div>

                <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                  {(["7D", "30D", "12M"] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setTimeRange(period)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        timeRange === period
                          ? "bg-white text-emerald-700 shadow-xs dark:bg-slate-700 dark:text-white"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      {period === "7D" ? "7D" : period === "30D" ? "30D" : "1Y"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 h-68 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0", opacity: 0.2 }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-xl bg-white/95 p-3 shadow-xl backdrop-blur-md dark:bg-slate-950/95">
                              <p className="text-xs font-bold text-slate-500">{label}</p>
                              <p className="font-heading text-lg font-black text-emerald-600 dark:text-emerald-400">
                                ${Number(payload[0]?.value).toLocaleString()}
                              </p>
                              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                Orders: {payload[0]?.payload?.orders} units
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                <div className="text-center">
                  <span className="text-[11px] text-slate-400">Daily Average</span>
                  <p className="font-heading text-base font-black text-slate-900 dark:text-white">
                    $1,630.00
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-[11px] text-slate-400">Peak Day (Nov 30)</span>
                  <p className="font-heading text-base font-black text-emerald-600 dark:text-emerald-400">
                    $9,500.00
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-[11px] text-slate-400">Avg Order Value</span>
                  <p className="font-heading text-base font-black text-slate-900 dark:text-white">
                    $34.25
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Row: Staff & Operations Payroll Breakdown & Category Share */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Team Staff & Payroll Overview (2 Cols) */}
            <div className="rounded-2xl bg-white p-6 shadow-xs lg:col-span-2 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <IconBriefcase className="size-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                      Store Staff & Operational Payroll
                    </h3>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Headcount allocation across warehouse, catalog, support, and administrative teams.
                  </p>
                </div>
                <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  18 Active Members • $14.2k Pool
                </span>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold tracking-wider text-slate-400 uppercase dark:border-slate-800">
                      <th className="pb-3">Department & Shift</th>
                      <th className="pb-3">Headcount</th>
                      <th className="pb-3">Monthly Wage</th>
                      <th className="pb-3">Department Lead</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {STAFF_DEPARTMENTS.map((dept) => (
                      <tr key={dept.dept} className="text-xs transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                          {dept.dept}
                        </td>
                        <td className="py-3.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
                          {dept.count} members
                        </td>
                        <td className="py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                          {dept.payroll}
                        </td>
                        <td className="py-3.5 text-slate-600 dark:text-slate-300">
                          {dept.lead}
                        </td>
                        <td className="py-3.5 text-right">
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                            {dept.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sales by Category (1 Col) */}
            <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <IconChartPie className="size-5 text-blue-500" />
                <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Sales by Category
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Department sales distribution.
              </p>

              <div className="relative mt-2 h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]?.payload
                          return (
                            <div className="rounded-xl bg-white p-2.5 shadow-xl dark:bg-slate-950">
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {data.name}
                              </p>
                              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                {data.amount} ({data.value}%)
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-medium text-slate-400">Total</span>
                  <span className="font-heading text-base font-black text-slate-900 dark:text-white">
                    $48.9k
                  </span>
                </div>
              </div>

              <div className="mt-2 space-y-1.5">
                {CATEGORY_DATA.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-slate-600 dark:text-slate-300 truncate max-w-[140px]">
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white">{cat.amount}</span>
                      <span className="font-mono text-slate-400">({cat.value}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900/80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Recent Customer Checkouts
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live updates from customer purchases across all regional fulfillment nodes.
                </p>
              </div>
              <a
                href="/orders"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                <span>View all orders</span>
                <IconArrowUpRight className="size-4" />
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold tracking-wider text-slate-400 uppercase dark:border-slate-800">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Item Summary</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Fulfillment</th>
                    <th className="pb-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {RECENT_ORDERS.map((order) => {
                    const isDelivered = order.status === "Delivered"
                    const isProcessing = order.status === "Processing"
                    const isShipped = order.status === "Shipped"

                    return (
                      <tr key={order.id} className="text-xs transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {order.id}
                        </td>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">
                          {order.customer}
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">{order.product}</td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {order.amount}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                              isDelivered
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                : isProcessing
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                : isShipped
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-400 dark:text-slate-500">
                          {order.date}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MARKETING & AD CAMPAIGN EXPENSES (Clean borderless) */}
      {/* ======================================================== */}
      {activeTab === "marketing-expenses" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Expense KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Total Ad Spend
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                  <IconReceiptTax className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  <AnimatedNumber value={4850} prefix="$" decimals={2} duration={1200} />
                </div>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                  ROAS 10.1x
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Meta, Google, TikTok Ads</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Event & Voucher Subsidies
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                  <IconSparkles className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  <AnimatedNumber value={3420} prefix="$" decimals={2} duration={1200} />
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  3 Campaigns
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Flash Deals & Free 2H Ship</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Platform & Gateway Fees
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                  <IconCoin className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  <AnimatedNumber value={1154} prefix="$" decimals={2} duration={1200} />
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  2.36% of Rev
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">VietQR, Cards & Fulfillment</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Net Operating Profit
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <IconTrendingUp className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-heading text-2xl font-black tracking-tight text-emerald-600 sm:text-3xl dark:text-emerald-400">
                  <AnimatedNumber value={25246} prefix="$" decimals={2} duration={1400} />
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  51.6% Net Margin
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">After staff, marketing & fees</p>
            </div>
          </div>

          {/* Clean Row: Financial Flow & Borderless Advertising Channels */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Daily Financial Flow */}
            <div className="rounded-2xl bg-white p-6 shadow-xs lg:col-span-2 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <IconReceiptTax className="size-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                      Daily Financial Trajectory & Margin Retention
                    </h3>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Gross sales comparison against marketing ad spend and event discount subsidies.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span className="size-2 rounded-sm bg-emerald-500" />
                    Net Profit
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-500">
                    <span className="size-2 rounded-sm bg-blue-500" />
                    Ad Spend
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-500">
                    <span className="size-2 rounded-sm bg-purple-500" />
                    Event Subsidy
                  </span>
                </div>
              </div>

              <div className="mt-6 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DAILY_FINANCIAL_FLOW} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0", opacity: 0.2 }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0]?.payload
                          return (
                            <div className="rounded-xl bg-white p-3 shadow-xl dark:bg-slate-950">
                              <p className="text-xs font-bold text-slate-500">{label}</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                Gross: ${data.gross.toLocaleString()}
                              </p>
                              <div className="mt-1 space-y-0.5 text-xs">
                                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                  Net Profit: ${data.net.toLocaleString()}
                                </p>
                                <p className="text-blue-500">
                                  Ad Spend: ${data.adSpend.toLocaleString()}
                                </p>
                                <p className="text-purple-500">
                                  Event Costs: ${data.eventCost.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="net" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="adSpend" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="eventCost" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Clean Borderless Advertising Channels (Refactored based on user feedback) */}
            <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <IconBrandMeta className="size-5 text-blue-600" />
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Advertising Channels
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Budget allocation and verified return on ad spend.
              </p>

              <div className="mt-5 space-y-2.5">
                {AD_SPEND_CHANNELS.map((channel) => {
                  const Icon = channel.icon
                  return (
                    <div
                      key={channel.name}
                      className="rounded-xl bg-slate-50/70 p-3 transition hover:bg-slate-100/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/70"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-4" style={{ color: channel.color }} />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {channel.name}
                          </span>
                        </div>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                          {channel.roas} ROAS
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          ${channel.amount.toLocaleString()}
                        </span>
                        <span className="font-mono text-slate-400">
                          {channel.percentage}% of budget
                        </span>
                      </div>

                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${channel.percentage * 2.5}%`,
                            backgroundColor: channel.color,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Active Marketing Events Table */}
          <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900/80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Active Campaign Events & Voucher Subsidies
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Performance tracking for flash deals, shipping discounts, and seasonal vouchers.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold tracking-wider text-slate-400 uppercase dark:border-slate-800">
                    <th className="pb-3">Event Campaign</th>
                    <th className="pb-3">Discount Subsidy</th>
                    <th className="pb-3">Sales Generated</th>
                    <th className="pb-3">Fulfillment Volume</th>
                    <th className="pb-3">Net ROAS</th>
                    <th className="pb-3 text-right">Campaign Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {CAMPAIGN_EVENTS.map((event) => (
                    <tr key={event.name} className="text-xs transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {event.name}
                      </td>
                      <td className="py-3.5 font-semibold text-rose-600 dark:text-rose-400">
                        {event.discountSubsidy}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {event.revenueGenerated}
                      </td>
                      <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {event.orders} checkouts
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {event.roas}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            event.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SYSTEM SLA & HEALTH (Clean borderless) */}
      {/* ======================================================== */}
      {activeTab === "system-health" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top SLA KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* 1. Request Failure Rate */}
            <div className="rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Request Failure Rate
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <IconAlertCircle className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-heading text-2xl font-black tracking-tight text-emerald-600 sm:text-3xl dark:text-emerald-400">
                  <AnimatedNumber value={0.038} decimals={3} suffix="%" duration={1200} />
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  PASS SLA
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Target &lt; 0.100% (4xx: 0.032%, 5xx: 0.006%)
              </p>
            </div>

            {/* 2. Cumulative Downtime */}
            <div className="rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  30-Day Downtime
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                  <IconClockCheck className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  8m 42s
                </div>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                  99.98% UPTIME
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Zero unplanned outages • MTTR: 1.8 mins
              </p>
            </div>

            {/* 3. p50 Latency */}
            <div className="rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  p50 Latency (Median)
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <IconActivity className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  <AnimatedNumber value={22} suffix=" ms" decimals={0} duration={1000} />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Fast
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Database & Redis hits</p>
            </div>

            {/* 4. p95 Latency */}
            <div className="rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  p95 Latency
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                  <IconActivity className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  <AnimatedNumber value={68} suffix=" ms" decimals={0} duration={1100} />
                </div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Target &lt; 100ms
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Complex queries & joins</p>
            </div>

            {/* 5. p99 Latency */}
            <div className="rounded-2xl bg-white p-5 shadow-xs dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  p99 Latency (Tail)
                </span>
                <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                  <IconActivity className="size-4.5" />
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  <AnimatedNumber value={148} suffix=" ms" decimals={0} duration={1200} />
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  Target &lt; 250ms
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Third-party payment gateways</p>
            </div>
          </div>

          {/* p50, p95, p99 Latency Distribution Graph */}
          <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900/80">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <IconActivity className="size-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                    API Response Latency Percentiles (p50 / p95 / p99)
                  </h3>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Hourly latency distribution across all production endpoints over the last 24 hours.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  p50 Median
                </span>
                <span className="flex items-center gap-1.5 text-amber-500">
                  <span className="size-2 rounded-full bg-amber-500" />
                  p95 SLA
                </span>
                <span className="flex items-center gap-1.5 text-purple-500">
                  <span className="size-2 rounded-full bg-purple-500" />
                  p99 Tail
                </span>
              </div>
            </div>

            <div className="mt-6 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LATENCY_PERCENTILES_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0", opacity: 0.2 }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}ms`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length >= 3) {
                        return (
                          <div className="rounded-xl bg-white p-3 shadow-xl dark:bg-slate-950">
                            <p className="text-xs font-bold text-slate-500">Time: {label}</p>
                            <div className="mt-1 space-y-1 text-xs">
                              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                                p50 (Median): {payload[0]?.value} ms
                              </p>
                              <p className="font-bold text-amber-500">
                                p95: {payload[1]?.value} ms
                              </p>
                              <p className="font-bold text-purple-500">
                                p99 (Tail): {payload[2]?.value} ms
                              </p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p50"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#10b981" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p95"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#f59e0b" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p99"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#8b5cf6" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Microservices Health Table */}
          <div className="rounded-2xl bg-white p-6 shadow-xs dark:bg-slate-900/80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Core Backend & Gateway Services
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Individual service response times, availability status, and health indicators.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                <IconCheck className="size-3.5" />
                All 5 Services Operational
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold tracking-wider text-slate-400 uppercase dark:border-slate-800">
                    <th className="pb-3">Service Name</th>
                    <th className="pb-3">Average Latency</th>
                    <th className="pb-3">Monthly Uptime</th>
                    <th className="pb-3 text-right">Service Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {SYSTEM_SERVICES.map((service) => (
                    <tr key={service.name} className="text-xs transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        {service.name}
                      </td>
                      <td className="py-3.5 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {service.latency}
                      </td>
                      <td className="py-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {service.uptime}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          {service.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
