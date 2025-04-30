"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { getNftIpfsUrl } from "@/lib/actions"

export function NftGallery() {
  // NFT IPFS URL - using fallback for client-side
  const [nftImageUrl, setNftImageUrl] = useState("/images/nft-character.png")

  // Fetch the NFT IPFS URL from server
  useEffect(() => {
    async function fetchNftUrl() {
      try {
        const url = await getNftIpfsUrl()
        if (url) {
          setNftImageUrl(url)
        }
      } catch (error) {
        console.error("Error fetching NFT URL:", error)
      }
    }

    fetchNftUrl()
  }, [])

  // Mock NFT data - in a real app, we would fetch this from the blockchain
  const nfts = [
    {
      id: "1",
      name: "RARE Character #1",
      image: nftImageUrl || "/images/nft-character-rare.png",
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <div key={nft.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Image
              src={nft.image || "/placeholder.svg"}
              alt={nft.name}
              width={300}
              height={300}
              className="rounded-lg w-full aspect-square object-cover mb-4"
              unoptimized={true} // Always unoptimize to handle IPFS URLs
            />
            <h3 className="text-xl font-bold text-white">{nft.name}</h3>
          </div>
        ))}
      </div>

      {nfts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white text-xl">You don't have any NFTs yet.</p>
          <p className="text-white/70">Mint your first NFT to get started!</p>
        </div>
      )}
    </div>
  )
}
