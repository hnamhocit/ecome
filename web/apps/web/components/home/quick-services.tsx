"use client"

import React from "react"
import {
  IconTruckDelivery,
  IconBuildingStore,
  IconFlame,
  IconTicket,
  IconBolt,
  IconRotateClockwise
} from "@tabler/icons-react"

const QUICK_SERVICES = [
  { id: "freeship", title: "Free Shipping", desc: "Orders over $15", icon: IconTruckDelivery, color: "bg-emerald-500" },
  { id: "mall", title: "ECOME Mall", desc: "100% Genuine Tech", icon: IconBuildingStore, color: "bg-rose-500" },
  { id: "deal", title: "Mega Deals", desc: "Starting at $4.99", icon: IconFlame, color: "bg-orange-500" },
  { id: "voucher", title: "Vouchers", desc: "Up to $25 Off", icon: IconTicket, color: "bg-blue-500" },
  { id: "fast", title: "2H Express", desc: "Same-Day Delivery", icon: IconBolt, color: "bg-purple-500" },
  { id: "return", title: "30-Day Returns", desc: "Hassle-Free Policy", icon: IconRotateClockwise, color: "bg-teal-500" },
]

export function QuickServices() {
  return (
    <div className="rounded-2xl bg-card px-2 py-3 shadow-xs sm:px-4 sm:py-4">
      <div className="flex w-full items-start justify-between gap-1 overflow-x-auto sm:grid sm:grid-cols-6 sm:gap-2">
        {QUICK_SERVICES.map((service) => {
          const Icon = service.icon
          return (
            <button
              key={service.id}
              className="group flex flex-1 shrink-0 flex-col items-center gap-2 rounded-xl p-1 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/40 sm:p-2"
            >
              <div className={`flex size-9 items-center justify-center rounded-xl text-white shadow-xs transition-transform group-hover:scale-105 sm:size-10 ${service.color}`}>
                <Icon className="size-5 sm:size-6" stroke={1.5} />
              </div>

              <div className="text-center">
                <p className="text-[11px] font-bold text-foreground sm:text-xs">
                  {service.title}
                </p>
                <p className="mt-0.5 text-[9px] text-muted-foreground sm:text-[10px]">
                  {service.desc}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
