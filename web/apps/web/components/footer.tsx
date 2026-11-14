import Link from "next/link"
import {
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandTiktok,
  IconPhoneCall,
  IconMail,
  IconRosetteDiscountCheck,
  IconShieldLock,
  IconLock,
} from "@tabler/icons-react"

const CUSTOMER_CARE_LINKS = [
  { label: "Help Center & FAQ", href: "#" },
  { label: "Ordering & Payment Guide", href: "#" },
  { label: "Nationwide Free Shipping Policy", href: "#" },
  { label: "Return & Refund Policy", href: "#" },
  { label: "Track Your Order", href: "#" },
  { label: "Warranty & Guarantee Terms", href: "#" },
] as const

const ABOUT_ECOME_LINKS = [
  { label: "About ECOME Platform", href: "#" },
  { label: "Careers & Tech Culture", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "B2B Enterprise Solutions", href: "#" },
  { label: "Affiliate Program", href: "#" },
] as const

const PAYMENT_METHODS = ["VIETQR", "VISA", "MASTER", "JCB", "MOMO", "COD"] as const
const SHIPPING_PARTNERS = ["GHN Express", "Viettel Post", "J&T Express"] as const

export function Footer() {
  return (
    <footer className="mt-14 w-full border-t border-slate-800 bg-[#0F172A] text-slate-300 dark:bg-[#020617]">
      <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:px-8 xl:px-10">
        {/* Top Brand & Social Strip */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 font-heading text-lg font-black text-white shadow-md shadow-emerald-500/20">
              E
            </span>
            <div>
              <span className="font-heading text-xl font-black tracking-tight text-white">
                ECOME
              </span>
              <p className="text-xs text-slate-400">
                Official premium tech e-commerce platform • 2H express delivery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="mr-1 text-xs text-slate-400">Connect with us:</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="ECOME on Facebook"
              className="flex size-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-400"
            >
              <IconBrandFacebook className="size-4.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="ECOME on YouTube"
              className="flex size-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-400"
            >
              <IconBrandYoutube className="size-4.5" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="ECOME on TikTok"
              className="flex size-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-400"
            >
              <IconBrandTiktok className="size-4.5" />
            </a>
          </div>
        </div>

        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 gap-8 text-xs sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Col 1: Customer Care */}
          <div>
            <h4 className="mb-3.5 font-heading text-xs font-bold tracking-wider text-white uppercase">
              Customer Support
            </h4>
            <ul className="space-y-2">
              {CUSTOMER_CARE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: About ECOME */}
          <div>
            <h4 className="mb-3.5 font-heading text-xs font-bold tracking-wider text-white uppercase">
              About ECOME
            </h4>
            <ul className="space-y-2">
              {ABOUT_ECOME_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Payment & Shipping */}
          <div>
            <h4 className="mb-3.5 font-heading text-xs font-bold tracking-wider text-white uppercase">
              Payment Methods
            </h4>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-300"
                >
                  {method}
                </span>
              ))}
            </div>

            <h4 className="mt-6 mb-3 font-heading text-xs font-bold tracking-wider text-white uppercase">
              Shipping Partners
            </h4>
            <div className="flex flex-wrap gap-2">
              {SHIPPING_PARTNERS.map((partner) => (
                <span
                  key={partner}
                  className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-300"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Trust & Certifications */}
          <div>
            <h4 className="mb-3.5 font-heading text-xs font-bold tracking-wider text-white uppercase">
              Security & Certification
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-blue-500/35 bg-gradient-to-r from-blue-950/60 to-slate-900 p-2.5 text-white">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <IconRosetteDiscountCheck className="size-5" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[10px] font-black tracking-wide text-blue-300 uppercase">
                    REGISTERED
                  </span>
                  <span className="block text-[10px] font-medium text-slate-300">
                    E-Commerce Ministry Certified
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/35 bg-gradient-to-r from-emerald-950/60 to-slate-900 p-2.5 text-white">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <IconShieldLock className="size-5" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[10px] font-black tracking-wide text-emerald-300 uppercase">
                    PCI-DSS Level 1
                  </span>
                  <span className="block text-[10px] font-medium text-slate-300">
                    Global Payment Security Standard
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-slate-700/80 bg-slate-800/50 p-2.5 text-white">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-slate-200">
                  <IconLock className="size-4.5" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[10px] font-bold text-slate-200">
                    256-Bit SSL Encryption
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    100% Secure Checkout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Legal & Contact Info */}
        <div className="mt-10 space-y-2 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <h5 className="font-heading text-sm font-bold text-white">
              ECOME GLOBAL E-COMMERCE CORPORATION
            </h5>
            <span className="text-[11px] text-slate-400">
              License No. 0316888888 • International Trade Certified
            </span>
          </div>

          <p>
            Headquarters: ECOME Tower, 68 Nguyen Hue Boulevard, District 1, Ho Chi Minh City, Vietnam.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-slate-300">
            <a
              href="tel:19008888"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-400"
            >
              <IconPhoneCall className="size-3.5 text-emerald-400" />
              <span>
                24/7 Support:{" "}
                <strong className="font-mono text-emerald-400">1900 8888</strong>
              </span>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="mailto:support@ecome.vn"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-emerald-400"
            >
              <IconMail className="size-3.5 text-emerald-400" />
              <span>
                Email: <span className="text-emerald-400">support@ecome.vn</span>
              </span>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="mailto:b2b@ecome.vn"
              className="transition-colors hover:text-emerald-400"
            >
              Business Inquiries:{" "}
              <span className="text-emerald-400">b2b@ecome.vn</span>
            </a>
          </div>

          <p className="pt-2 text-[11px] text-slate-500">
            © {new Date().getFullYear()} ECOME Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
