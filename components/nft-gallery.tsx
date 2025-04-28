"use client"

import Image from "next/image"

export function NftGallery() {
  // Mock NFT data - in a real app, we would fetch this from the blockchain
  const nfts = [
    {
      id: "1",
      name: "Polygon Head #1",
      image: "/images/profile-nft.png",
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
