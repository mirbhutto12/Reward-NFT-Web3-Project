"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function MintSection() {
  const { connected, balance, connect } = useWallet()
  const [minting, setMinting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Mock SOL price - in a real app, we would fetch this from an API
  const solPrice = 150 // $150 per SOL
  const mintPriceUSD = 10
  const mintPriceSOL = mintPriceUSD / solPrice

  const handleMint = async () => {
    if (!connected) {
      await connect()
      return
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

      // Simulate minting process
      toast({
        title: "Minting in progress",
        description: "Please wait while we mint your NFT...",
      })

      // Simulate blockchain delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page
      router.push("/success")
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
          <Image src="/images/gift-box.png" alt="NFT Gift Box" width={200} height={200} className="rounded-lg" />
        </div>

        <Button
          className="w-full bg-white/20 hover:bg-white/30 text-white text-xl py-6 rounded-full"
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
