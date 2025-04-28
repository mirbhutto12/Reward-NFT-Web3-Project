"use client"

import { useWallet } from "@/hooks/use-wallet"
import Image from "next/image"

export function ProfileHeader() {
  const { publicKey, balance } = useWallet()

  // Format public key for display
  const displayAddress = publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : "Not connected"

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12">
      <div>
        <h2 className="text-4xl font-bold text-white mb-4">My NFTs</h2>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-theme-teal mb-2">
          <Image src="/images/nft-character.png" alt="Profile" width={96} height={96} className="object-cover" />
        </div>
        <h3 className="text-2xl font-bold text-white">user123</h3>
        <p className="text-white">Balance: {balance.toFixed(2)} USDC</p>
      </div>
    </div>
  )
}
