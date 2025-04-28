"use client"

import { NavBar } from "@/components/nav-bar"
import { ReferralStats } from "@/components/referral-stats"
import { Leaderboard } from "@/components/leaderboard"
import { QuestSection } from "@/components/quest-section"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ReferralsPage() {
  const { connected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!connected) {
      router.push("/")
    }
  }, [connected, router])

  if (!connected) {
    return null
  }

  return (
    <main className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-8">
        <NavBar />
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-3xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-6xl font-bold text-white mb-8">Referrals</h1>
              <ReferralStats />
              <QuestSection />
            </div>
            <div>
              <h2 className="text-6xl font-bold text-white mb-8">Leaderboard</h2>
              <Leaderboard />
            </div>
          </div>
        </div>
        <footer className="text-center text-white mt-8">
          <p>Powered by Reward NFT</p>
        </footer>
      </div>
    </main>
  )
}
