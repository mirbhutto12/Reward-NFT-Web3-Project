"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { mintNFT } from "@/lib/solana"

export function MintSection() {
  const { connected, balance, connect, solPrice, publicKey } = useWallet()
  const [minting, setMinting] = useState(false)
  const [mintPriceUSD] = useState(10) // Fixed price in USD
  const [mintPriceSOL, setMintPriceSOL] = useState(0)
  const { toast } = useToast()
  const router = useRouter()

  // Calculate mint price in SOL based on current SOL price
  useEffect(() => {
    if (solPrice > 0) {
      setMintPriceSOL(mintPriceUSD / solPrice)
    }
  }, [solPrice, mintPriceUSD])

  const handleMint = async () => {
    if (!connected) {
      try {
        await connect()
        // After connection, we should check again if connected before proceeding
        // This will be handled on the next render if connection was successful
        return
      } catch (error) {
        console.error("Connection error:", error)
        toast({
          title: "Connection required",
          description: "Please connect your wallet to mint an NFT.",
          variant: "destructive",
        })
        return
      }
    }

    // Check if user has enough balance
    if (balance < mintPriceSOL) {
      toast({
        title: "Insufficient balance",
        description: `You need at least ${mintPriceSOL.toFixed(4)} SOL to mint an NFT.`,
        variant: "destructive",
      })
      return
    }

    try {
      setMinting(true)

      // Show minting toast
      toast({
        title: "Minting in progress",
        description: "Please wait while we mint your NFT...",
      })

      // Call the mintNFT function from solana.ts
      const result = await mintNFT(
        publicKey || "your-wallet-address", // Use the actual public key if available
        mintPriceSOL,
      )

      if (result.success) {
        toast({
          title: "NFT Minted!",
          description: `Transaction ID: ${result.txId?.slice(0, 8)}...${result.txId?.slice(-8)}`,
        })

        // Redirect to success page
        router.push("/success?image=/images/nft-character.png")
      } else {
        toast({
          title: "Minting failed",
          description: result.error || "There was an error minting your NFT. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error minting NFT:", error)
      toast({
        title: "Minting failed",
        description: "There was an error minting your NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setMinting(false)
    }
  }

  return (
    <div className="mt-12 text-center">
      <h1 className="text-6xl font-bold text-white mb-4">Mint Your NFT</h1>
      <p className="text-xl text-white mb-12">Mint an exclusive NFT on Solana</p>

      <div className="max-w-sm mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
        <div className="flex justify-center mb-6">
          <Image src="/images/nft-character.png" alt="NFT Character" width={200} height={200} className="rounded-lg" />
        </div>

        <Button
          className="w-full bg-theme-teal hover:bg-theme-teal/80 text-theme-dark text-xl py-6 rounded-full"
          onClick={handleMint}
          disabled={minting}
        >
          {minting ? "Minting..." : "Mint NFT"}
        </Button>

        <p className="text-white mt-4 text-sm">
          Price: {mintPriceSOL.toFixed(4)} SOL (≈ ${mintPriceUSD})
        </p>
      </div>
    </div>
  )
}
