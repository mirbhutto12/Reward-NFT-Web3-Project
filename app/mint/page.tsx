"use client"

import { NavBar } from "@/components/nav-bar"
import { useWallet } from "@/hooks/use-wallet"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Check, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function MintPage() {
  const { connected, publicKey, balance, usdtBalance } = useWallet()
  const [minting, setMinting] = useState(false)
  const [mintingProgress, setMintingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Ensure we have default values to prevent undefined errors
  const safeBalance = balance || 0
  const safeUsdtBalance = usdtBalance || 0

  const handleMint = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first")
      return
    }

    if (safeUsdtBalance < 10) {
      setError("Insufficient USDC balance. You need at least 10 USDC to mint.")
      return
    }

    setMinting(true)
    setMintingProgress(0)
    setError(null)

    try {
      // Simulate minting process
      await simulateMinting()

      // Redirect to success page
      router.push("/success")
    } catch (error) {
      console.error("Error minting NFT:", error)
      setError("Failed to mint NFT. Please try again.")
      setMinting(false)
    }
  }

  const simulateMinting = async () => {
    // Simulate the minting process with progress updates
    for (let i = 0; i <= 100; i += 10) {
      setMintingProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <NavBar />

        <div className="mt-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Mint Your Exclusive NFT</h1>
          <p className="text-white/90 mb-8">
            Mint your unique identity NFT for 10 USDC and unlock access to our referral program and exclusive rewards.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
              <div className="relative w-full aspect-square mb-4">
                <Image src="/images/nft-character.png" alt="Exclusive NFT Character" fill className="object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Exclusive Identity NFT</h2>
              <p className="text-white/90 mb-4">
                A unique digital identity that represents you in our ecosystem. Only one per wallet.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-white/90">Price:</span>
                <span className="text-white font-bold">10 USDC</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">Mint Details</h2>

              {!connected ? (
                <div className="bg-white/20 text-white p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p>Please connect your wallet to mint an NFT</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-white/90">Wallet:</span>
                      <span className="text-white">
                        {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "Not connected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/90">SOL Balance:</span>
                      <span className="text-white">{safeBalance.toFixed(2)} SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/90">USDC Balance:</span>
                      <span className={`text-white ${safeUsdtBalance < 10 ? "text-red-300" : ""}`}>
                        {safeUsdtBalance.toFixed(2)} USDC
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-white/20 text-white p-4 rounded-lg mb-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <p>{error}</p>
                      </div>
                    </div>
                  )}

                  {minting && (
                    <div className="mb-4">
                      <p className="text-white mb-2">Minting in progress: {mintingProgress}%</p>
                      <div className="w-full bg-white/10 rounded-full h-2.5">
                        <div className="bg-white h-2.5 rounded-full" style={{ width: `${mintingProgress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-white text-[#001F2B] hover:bg-white/90 py-6"
                    onClick={handleMint}
                    disabled={minting || safeUsdtBalance < 10}
                  >
                    {minting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      "Mint NFT for 10 USDC"
                    )}
                  </Button>
                </>
              )}

              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white/90 text-sm">Powered by Solana for low gas fees</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white/90 text-sm">Limited to one NFT per wallet</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white/90 text-sm">Unlocks access to the referral system</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white/90 text-sm">Future utility and benefits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
