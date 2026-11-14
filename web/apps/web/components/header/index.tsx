"use client"

import { TopBar } from "./top-bar"
import { MainHeader } from "./main-header"
import { SubNav } from "./sub-nav"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-md select-none">
      <TopBar />
      <MainHeader />
      <SubNav />
    </header>
  )
}
