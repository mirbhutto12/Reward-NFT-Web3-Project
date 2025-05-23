"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { mintNFT, calculateMintPriceInSol } from "@/lib/solana"
import { getNftIpfsUrl } from "@/lib/actions"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

export function MintSection() {
  const { connected, balance, solPrice, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [minting, setMinting] = useState(false)
  const [mintPriceUSD] = useState(10) // Fixed price in USD
  const [mintPriceSOL, setMintPriceSOL] = useState(0)
  const [loadingPrice, setLoadingPrice] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // Ensure we have default values to prevent undefined errors
  const safeBalance = balance || 0
  const safeSolPrice = solPrice || 150

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

  // Calculate mint price in SOL based on current SOL price
  useEffect(() => {
    const updateMintPrice = async () => {
      try {
        setLoadingPrice(true)
        // Use the calculateMintPriceInSol function from solana.ts
        const price = await calculateMintPriceInSol(mintPriceUSD)
        setMintPriceSOL(price)
      } catch (error) {
        console.error("Error calculating mint price:", error)
        // Fallback calculation if there's an error
        if (safeSolPrice > 0) {
          setMintPriceSOL(mintPriceUSD / safeSolPrice)
        } else {
          setMintPriceSOL(mintPriceUSD / 150) // Default SOL price as fallback
        }
      } finally {
        setLoadingPrice(false)
      }
    }

    updateMintPrice()
  }, [safeSolPrice, mintPriceUSD])

  const handleMint = async () => {
    // If not connected, open the wallet modal
    if (!connected) {
      try {
        setVisible(true)
        toast({
          title: "Connection required",
          description: "Please connect your wallet to mint an NFT.",
        })
        return
      } catch (error) {
        console.error("Connection error:", error)
        toast({
          title: "Connection failed",
          description: "Failed to open wallet selection. Please try again.",
          variant: "destructive",
        })
        return
      }
    }

    // Check if user has enough balance
    if (safeBalance < mintPriceSOL) {
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
        publicKey || "A9GT8pYUR5F1oRwUsQ9ADeZTWq7LJMfmPQ3TZLmV6cQP", // Use the actual public key if available
        mintPriceSOL,
      )

      if (result.success) {
        toast({
          title: "NFT Minted!",
          description: `Transaction ID: ${result.txId?.slice(0, 8)}...${result.txId?.slice(-8)}`,
        })

        // Redirect to success page with the NFT image
        router.push(`/success?image=${encodeURIComponent(nftImageUrl)}`)
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
          <Image
            src={nftImageUrl || "/images/nft-character-rare.png"}
            alt="RARE NFT Character"
            width={200}
            height={200}
            className="rounded-lg"
            unoptimized={nftImageUrl.includes("ipfs")} // Disable optimization for IPFS URLs
          />
        </div>

        <Button
          className="w-full bg-[#00FFE0] hover:bg-opacity-80 text-[#001F2B] text-xl py-6 rounded-full"
          onClick={handleMint}
          disabled={minting || loadingPrice}
        >
          {minting ? "Minting..." : "Mint NFT"}
        </Button>

        <p className="text-white mt-4 text-sm">
          {loadingPrice ? "Calculating price..." : `Price: ${mintPriceSOL.toFixed(4)} SOL (≈ $${mintPriceUSD})`}
        </p>
      </div>
    </div>
  )
}
