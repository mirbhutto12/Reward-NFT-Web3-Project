"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function AirdropPage() {
  const { connected, publicKey } = useWallet()
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
    setClaiming(true)

    try {
      // Simulate airdrop claim
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Record claim time
      localStorage.setItem("lastAirdropClaim", Date.now().toString())
      setTimeLeft(24) // 24 hours cooldown

      toast({
        title: "Airdrop claimed!",
        description: "0.01 SOL has been sent to your wallet.",
      })
    } catch (error) {
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

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
                  className="text-white"
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

            {timeLeft ? (
              <div>
                <p className="text-white mb-4">Next airdrop available in approximately {timeLeft} hours</p>
                <Button disabled className="w-full py-6 bg-blue-500/50 text-white/70">
                  Claim Airdrop
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full py-6 bg-blue-500 hover:bg-blue-600 text-white"
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
