"use client"

import React from "react"

export function Footer() {
  return (
    <footer className="mt-12 w-full border-t border-slate-800 bg-[#0F172A] text-slate-300 select-none dark:bg-[#020617]">
      {/* Main Enterprise Footer Content */}
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* Column 1: Chăm sóc khách hàng */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
              Chăm sóc khách hàng
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Trung tâm trợ giúp ECOME
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Hướng dẫn đặt hàng & thanh toán
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Chính sách Freeship Toàn Quốc
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Chính sách đổi trả & hoàn tiền
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Tra cứu tình trạng đơn hàng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Chính sách bảo hành sản phẩm
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Về ECOME */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
              Về ECOME Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Giới thiệu nền tảng ECOME
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Tuyển dụng nhân tài Tech
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Quy chế hoạt động sàn TMĐT
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Chính sách bảo mật thông tin
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Bán hàng doanh nghiệp (B2B)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-emerald-400"
                >
                  Tiếp thị liên kết (Affiliate)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Hợp tác & Thanh toán */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
              Phương thức thanh toán
            </h4>
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <span className="rounded border border-slate-700 bg-slate-800/80 p-1.5 text-[11px] font-bold text-slate-200">
                VIETQR
              </span>
              <span className="rounded border border-slate-700 bg-slate-800/80 p-1.5 text-[11px] font-bold text-slate-200">
                VISA
              </span>
              <span className="rounded border border-slate-700 bg-slate-800/80 p-1.5 text-[11px] font-bold text-slate-200">
                MASTER
              </span>
              <span className="rounded border border-slate-700 bg-slate-800/80 p-1.5 text-[11px] font-bold text-slate-200">
                JCB
              </span>
              <span className="rounded border border-slate-700 bg-slate-800/80 p-1.5 text-[11px] font-bold text-slate-200">
                MOMO
              </span>
              <span className="rounded border border-slate-700 bg-slate-800/80 p-1.5 text-[11px] font-bold text-slate-200">
                COD
              </span>
            </div>

            <h4 className="mt-4 mb-2 font-heading text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
              Đối tác vận chuyển
            </h4>
            <div className="flex flex-wrap gap-1 text-[11px] text-slate-400">
              <span className="rounded border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 font-semibold text-emerald-400">
                ECOME Express
              </span>
              <span className="rounded border border-slate-700 bg-slate-800/60 px-2 py-0.5">
                GHN
              </span>
              <span className="rounded border border-slate-700 bg-slate-800/60 px-2 py-0.5">
                Viettel Post
              </span>
              <span className="rounded border border-slate-700 bg-slate-800/60 px-2 py-0.5">
                J&T Express
              </span>
            </div>
          </div>

          {/* Column 4: Tải app ECOME */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
              Tải ứng dụng ECOME
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex size-18 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow">
                <i className="ti ti-qrcode text-4xl text-slate-900" />
              </div>
              <div className="space-y-1.5 text-xs">
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-white transition-colors hover:bg-slate-700"
                >
                  <i className="ti ti-brand-apple text-base" />
                  <div className="text-left leading-tight">
                    <span className="block text-[9px] text-slate-400">
                      Tải về trên
                    </span>
                    <strong className="block text-[11px]">App Store</strong>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-white transition-colors hover:bg-slate-700"
                >
                  <i className="ti ti-brand-google-play text-base text-emerald-400" />
                  <div className="text-left leading-tight">
                    <span className="block text-[9px] text-slate-400">
                      Tải về trên
                    </span>
                    <strong className="block text-[11px]">Google Play</strong>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Column 5: Chứng nhận uy tín (Chỉnh lại chuyên nghiệp chuẩn sàn TMĐT) */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-bold tracking-wider text-white uppercase sm:text-sm">
              Chứng nhận uy tín
            </h4>
            <div className="flex flex-col gap-2.5">
              {/* Huy hiệu Bộ Công Thương chuẩn */}
              <div className="flex items-center gap-2.5 rounded-lg border border-blue-500/40 bg-gradient-to-r from-blue-950/60 to-slate-900 p-2 text-white shadow-sm">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <i className="ti ti-rosette-discount-check-filled text-base" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[10px] font-black tracking-wide text-blue-300 uppercase">
                    ĐÃ ĐĂNG KÝ
                  </span>
                  <span className="block text-[9px] font-medium text-slate-300">
                    BỘ CÔNG THƯƠNG
                  </span>
                </div>
              </div>

              {/* Huy hiệu PCI-DSS & An toàn thanh toán */}
              <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 to-slate-900 p-2 text-white shadow-sm">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <i className="ti ti-shield-lock-filled text-base" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[10px] font-black tracking-wide text-emerald-300 uppercase">
                    PCI-DSS Level 1
                  </span>
                  <span className="block text-[9px] font-medium text-slate-300">
                    Bảo mật chuẩn quốc tế
                  </span>
                </div>
              </div>

              {/* SSL 256-Bit Seal */}
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-800/60 p-2 text-white">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-slate-300">
                  <i className="ti ti-lock-filled text-sm" />
                </div>
                <div className="leading-tight">
                  <span className="block text-[10px] font-bold text-slate-200">
                    Mã hóa SSL 256-Bit
                  </span>
                  <span className="block text-[9px] text-slate-400">
                    Giao dịch an toàn 100%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Legal & Registration Details */}
        <div className="mt-10 space-y-2 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <h5 className="font-heading text-sm font-bold text-white">
              CÔNG TY CỔ PHẦN THƯƠNG MẠI ĐIỆN TỬ ECOME VIỆT NAM
            </h5>
            <span className="text-[11px] text-slate-400">
              Giấy phép sàn TMĐT số 0316888888/GP-BCT do Bộ Công Thương cấp
            </span>
          </div>
          <p>
            Địa chỉ: Tòa nhà ECOME Tower, Số 68 Nguyễn Huệ, Phường Bến Nghé,
            Quận 1, Thành phố Hồ Chí Minh, Việt Nam.
          </p>
          <p>
            Giấy chứng nhận Đăng ký Doanh nghiệp số 0316888888 do Sở Kế hoạch và
            Đầu tư TP. Hồ Chí Minh cấp ngày 15/01/2020.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300">
            <span>
              Tổng đài CSKH:{" "}
              <strong className="font-mono text-emerald-400">1900 8888</strong>{" "}
              (24/7, cước phí 1.000đ/phút)
            </span>
            <span>•</span>
            <span>
              Email: <span className="text-emerald-400">hotro@ecome.vn</span>
            </span>
            <span>•</span>
            <span>
              Hợp tác kinh doanh:{" "}
              <span className="text-emerald-400">b2b@ecome.vn</span>
            </span>
          </div>
          <p className="pt-2 text-[11px] text-slate-500">
            © 2026 ECOME Corporation. Tất cả quyền được bảo lưu. Nền tảng thương
            mại điện tử cam kết chính hãng và giao hàng hỏa tốc.
          </p>
        </div>
      </div>
    </footer>
  )
}
