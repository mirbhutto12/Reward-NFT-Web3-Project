"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { usePathname } from "next/navigation"

export function NavBar() {
  const { connected, connecting, connect, disconnect } = useWallet()
  const pathname = usePathname()

  return (
    <nav className="py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="bg-cyan-400 text-white rounded-lg w-12 h-12 flex items-center justify-center mr-2">
            <span className="text-2xl font-bold">R</span>
          </div>
          <span className="text-white text-2xl font-bold">Reward NFT</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className={`text-white text-lg ${pathname === "/" ? "font-bold" : ""}`}>
          Mint
        </Link>
        {connected && (
          <>
            <Link href="/referrals" className={`text-white text-lg ${pathname === "/referrals" ? "font-bold" : ""}`}>
              Referrals
            </Link>
            <Link href="/quests" className={`text-white text-lg ${pathname === "/quests" ? "font-bold" : ""}`}>
              Quests
            </Link>
            <Link href="/airdrop" className={`text-white text-lg ${pathname === "/airdrop" ? "font-bold" : ""}`}>
              Airdrop
            </Link>
          </>
        )}
      </div>

      <div>
        {connected ? (
          <Button variant="outline" className="text-white border-white hover:bg-white/10" onClick={disconnect}>
            Disconnect
          </Button>
        ) : (
          <Button
            className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
            onClick={connect}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>
    </nav>
  )
}
