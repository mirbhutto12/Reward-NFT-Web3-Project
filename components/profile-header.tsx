"use client"

import { useWallet } from "@/hooks/use-wallet"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getNftIpfsUrl } from "@/lib/actions"

// Profile image component that fetches the NFT IPFS URL from server
function ProfileImage() {
  const [imageUrl, setImageUrl] = useState("/images/nft-character-rare.png")

  useEffect(() => {
    async function fetchNftUrl() {
      try {
        const url = await getNftIpfsUrl()
        if (url) {
          setImageUrl(url)
        }
      } catch (error) {
        console.error("Error fetching NFT URL:", error)
      }
    }

    fetchNftUrl()
  }, [])

  return (
    <Image
      src={imageUrl || "/placeholder.svg"}
      alt="Profile"
      width={96}
      height={96}
      className="object-cover"
      unoptimized={true} // Disable optimization for IPFS URLs
    />
  )
}

export function ProfileHeader() {
  const { publicKey, balance, usdcBalance } = useWallet()

  // Format public key for display
  const displayAddress = publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : "Not connected"

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12">
      <div>
        <h2 className="text-4xl font-bold text-white mb-4">My NFTs</h2>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-theme-teal mb-2">
          <ProfileImage />
        </div>
        <h3 className="text-2xl font-bold text-white">{displayAddress}</h3>
        <p className="text-white">SOL Balance: {balance.toFixed(2)} SOL</p>
        <p className="text-white">USDC Balance: {usdcBalance.toFixed(2)} USDC</p>
      </div>
    </div>
  )
}
