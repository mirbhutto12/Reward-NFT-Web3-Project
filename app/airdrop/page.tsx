"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { requestAirdrop } from "@/lib/solana"

export default function AirdropPage() {
  const { connected, publicKey, isDevnet } = useWallet()
  const router = useRouter()
  const { toast } = useToast()
  const [claiming, setClaiming] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    if (!connected) {
      router.push("/")
    }
  }, [connected, router])

  useEffect(() => {
    // Check if user has already claimed airdrop
    const lastClaim = localStorage.getItem("lastAirdropClaim")
    if (lastClaim) {
      const timePassedMs = Date.now() - Number.parseInt(lastClaim)
      const cooldownMs = 24 * 60 * 60 * 1000 // 24 hours

      if (timePassedMs < cooldownMs) {
        setTimeLeft(Math.ceil((cooldownMs - timePassedMs) / (1000 * 60 * 60)))
      }
    }
  }, [])

  const handleClaim = async () => {
    if (!isDevnet) {
      toast({
        title: "Airdrops unavailable",
        description: "Airdrops are only available on devnet. This feature is not available on mainnet.",
        variant: "destructive",
      })
      return
    }

    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim the airdrop.",
        variant: "destructive",
      })
      return
    }

    setClaiming(true)

    try {
      // Request airdrop from Solana
      const success = await requestAirdrop(publicKey, 0.01)

      if (success) {
        // Record claim time
        localStorage.setItem("lastAirdropClaim", Date.now().toString())
        setTimeLeft(24) // 24 hours cooldown

        toast({
          title: "Airdrop claimed!",
          description: "0.01 SOL has been sent to your wallet.",
        })
      } else {
        toast({
          title: "Claim failed",
          description: "There was an error claiming your airdrop. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error claiming airdrop:", error)
      toast({
        title: "Claim failed",
        description: "There was an error claiming your airdrop. Please try again.",
        variant: "destructive",
      })
    } finally {
      setClaiming(false)
    }
  }

  if (!connected) {
    return null
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-8">
        <NavBar />
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-8">Airdrop</h1>
          <p className="text-xl text-white mb-8">Claim your daily SOL airdrop to help with gas fees</p>

          {isDevnet && (
            <div className="bg-theme-teal/20 text-white p-4 rounded-lg mb-6">
              <p className="font-medium">
                You are connected to Solana Devnet. Airdrops are available for testing purposes.
              </p>
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-theme-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-theme-dark"
                >
                  <path d="M12 2v6.5l5-3v-3.5z" />
                  <path d="M7 2v3.5l5 3v-6.5z" />
                  <path d="M2 9v3.5l5 3v-6.5z" />
                  <path d="M17 9v6.5l5-3v-3.5z" />
                  <path d="M7 22v-3.5l5-3v6.5z" />
                  <path d="M12 22v-6.5l5 3v3.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Daily SOL Airdrop</h2>
              <p className="text-white/70">Receive 0.01 SOL every 24 hours</p>
            </div>

            {!isDevnet ? (
              <div>
                <p className="text-white mb-4">
                  Airdrops are only available on devnet. This feature is not available on mainnet.
                </p>
                <Button disabled className="w-full py-6 bg-theme-yellow/50 text-white/70">
                  Claim Airdrop
                </Button>
              </div>
            ) : timeLeft ? (
              <div>
                <p className="text-white mb-4">Next airdrop available in approximately {timeLeft} hours</p>
                <Button disabled className="w-full py-6 bg-theme-yellow/50 text-white/70">
                  Claim Airdrop
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full py-6 bg-theme-yellow hover:bg-theme-yellow/80 text-theme-dark"
              >
                {claiming ? "Claiming..." : "Claim Airdrop"}
              </Button>
            )}

            <p className="text-white/70 mt-4 text-sm">
              Wallet: {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "Not connected"}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
