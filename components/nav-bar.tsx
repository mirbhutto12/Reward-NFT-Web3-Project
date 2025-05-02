"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useSolanaWallet } from "@/hooks/use-solana-wallet"

export function NavBar() {
  const { connected, isDevnet } = useSolanaWallet()
  const pathname = usePathname()

  return (
    <nav className="py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.jpeg" alt="Reward NFT Logo" width={48} height={48} className="mr-2" />
          <span className="text-white text-2xl font-bold">Reward NFT</span>
        </Link>
        {isDevnet && (
          <span className="ml-2 bg-[#00FFE0] text-[#001F2B] text-xs font-medium px-2 py-1 rounded-full">DEVNET</span>
        )}
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
            <Link href="/network" className={`text-white text-lg ${pathname === "/network" ? "font-bold" : ""}`}>
              Network
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <WalletConnectButton />
      </div>
    </nav>
  )
}
