"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useWallet } from "@/hooks/use-wallet"
import { Menu } from "lucide-react"
import { useState } from "react"

export function NavBar() {
  const { connected } = useWallet()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path ? "text-white font-bold" : "text-white/90 hover:text-white"
  }

  return (
    <nav className="py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="relative w-10 h-10 mr-2">
            <Image src="/images/logo.jpeg" alt="Reward NFT Logo" width={40} height={40} className="object-contain" />
          </div>
          <span className="text-white font-bold">Reward NFT</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <Link href="/" className={isActive("/")}>
          Mint
        </Link>
        <Link href="/referrals" className={isActive("/referrals")}>
          Referrals
        </Link>
        <Link href="/quests" className={isActive("/quests")}>
          Quests
        </Link>
        <Link href="/leaderboard" className={isActive("/leaderboard")}>
          Leaderboard
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        {connected && (
          <Link href="/profile">
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md hover:bg-white/30 transition-colors">
              My Profile
            </button>
          </Link>
        )}
        <WalletConnectButton />
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-4 left-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg z-50">
          <div className="flex flex-col space-y-4">
            <Link href="/" className={`${isActive("/")} py-2`} onClick={() => setMobileMenuOpen(false)}>
              Mint
            </Link>
            <Link
              href="/referrals"
              className={`${isActive("/referrals")} py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Referrals
            </Link>
            <Link href="/quests" className={`${isActive("/quests")} py-2`} onClick={() => setMobileMenuOpen(false)}>
              Quests
            </Link>
            <Link
              href="/leaderboard"
              className={`${isActive("/leaderboard")} py-2`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
