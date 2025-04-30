"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function NavBar() {
  const { connected, connecting, connect, disconnect, isDevnet } = useWallet()
  const pathname = usePathname()
  const { toast } = useToast()

  return (
    <nav className="py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.jpeg" alt="Reward NFT Logo" width={48} height={48} className="mr-2" />
          <span className="text-white text-2xl font-bold">Reward NFT</span>
        </Link>
        {isDevnet && (
          <span className="ml-2 bg-theme-teal text-theme-dark text-xs font-medium px-2 py-1 rounded-full">DEVNET</span>
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

      <div>
        {connected ? (
          <Button variant="outline" className="text-white border-white hover:bg-white/10" onClick={disconnect}>
            Disconnect
          </Button>
        ) : (
          <Button
            className="bg-theme-teal text-theme-dark hover:bg-theme-teal/80"
            onClick={() => {
              // Check if on mobile
              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

              if (isMobile) {
                // For mobile, try to open the Phantom app via deep link
                const phantomDeepLink = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`
                window.location.href = phantomDeepLink

                // Show toast with instructions after a short delay
                setTimeout(() => {
                  toast({
                    title: "Opening Phantom Wallet",
                    description: "If nothing happens, please install the Phantom wallet app first.",
                  })
                }, 1500)
              } else {
                // For desktop, use the normal connect flow
                connect()
              }
            }}
            disabled={connecting}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>
    </nav>
  )
}
