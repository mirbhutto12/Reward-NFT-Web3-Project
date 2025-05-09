"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/providers/wallet-provider"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { mintNFT } from "@/lib/nft-service"
import Image from "next/image"

interface NftMinterProps {
  className?: string
  companyWalletAddress: string
}

export function NftMinter({ className, companyWalletAddress }: NftMinterProps) {
  const { connected, publicKey, balanceVerified, transferUsdt } = useWallet()
  const [minting, setMinting] = useState(false)
  const [mintingProgress, setMintingProgress] = useState(0)
  const [mintingError, setMintingError] = useState<string | null>(null)
  const [mintingSuccess, setMintingSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const router = useRouter()

  const handleMint = async () => {
    if (!connected || !publicKey || !balanceVerified) {
      return
    }

    setMinting(true)
    setMintingProgress(0)
    setMintingError(null)

    try {
      // Step 1: Start the minting process
      setMintingProgress(10)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 2: Transfer USDT to company wallet
      setMintingProgress(30)
      const transferSuccess = await transferUsdt(companyWalletAddress, 10)

      if (!transferSuccess) {
        throw new Error("Failed to transfer USDT")
      }

      setMintingProgress(60)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 3: Mint the NFT
      const result = await mintNFT(publicKey)

      if (!result.success) {
        throw new Error(result.error || "Failed to mint NFT")
      }

      setMintingProgress(90)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 4: Complete the process
      setMintingProgress(100)
      setMintingSuccess(true)
      setTransactionId(result.transactionId || null)

      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push(
          `/success?txId=${result.transactionId}&image=${encodeURIComponent(result.nftData?.image || "")}&name=${encodeURIComponent(result.nftData?.name || "")}`,
        )
      }, 1500)
    } catch (error) {
      console.error("Error minting NFT:", error)
      setMintingError(error instanceof Error ? error.message : "Unknown error occurred")
      setMintingProgress(0)
    } finally {
      if (!mintingSuccess) {
        setMinting(false)
      }
    }
  }

  if (!connected) {
    return (
      <div className={`p-4 bg-yellow-500/10 rounded-lg ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className="text-yellow-500">Please connect your wallet first</p>
        </div>
      </div>
    )
  }

  if (!balanceVerified) {
    return (
      <div className={`p-4 bg-yellow-500/10 rounded-lg ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className="text-yellow-500">Please verify your USDT balance first</p>
        </div>
      </div>
    )
  }

  if (mintingSuccess) {
    return (
      <div className={`p-4 bg-green-500/10 rounded-lg ${className}`}>
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-green-500">NFT minted successfully!</p>
        </div>
        {transactionId && <p className="mt-2 text-sm">Transaction ID: {transactionId}</p>}
        <p className="mt-2 text-sm">Redirecting to success page...</p>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-white/10 rounded-lg ${className}`}>
      <h3 className="text-lg font-medium mb-2">Mint Your Exclusive NFT</h3>
      <p className="text-sm mb-4">
        You will be charged 10 USDT to mint this exclusive NFT. The NFT will be sent to your connected wallet.
      </p>

      <div className="mb-4">
        <Image
          src="/images/nft-character-rare.png"
          alt="Exclusive NFT"
          width={200}
          height={200}
          className="mx-auto rounded-lg"
        />
      </div>

      {minting && (
        <div className="mb-4">
          <p className="text-sm mb-2">Minting in progress...</p>
          <Progress value={mintingProgress} className="h-2" />
          <p className="text-xs mt-1 text-center">{mintingProgress}%</p>
        </div>
      )}

      {mintingError && (
        <div className="mb-4 p-3 bg-red-500/10 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-500">{mintingError}</p>
          </div>
        </div>
      )}

      <Button
        onClick={handleMint}
        disabled={minting}
        className="w-full bg-[#00FFE0] text-[#001F2B] hover:bg-opacity-80"
      >
        {minting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting...
          </>
        ) : (
          "Mint NFT for 10 USDT"
        )}
      </Button>
    </div>
  )
}
