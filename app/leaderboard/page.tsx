"use client"

import { NavBar } from "@/components/nav-bar"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type LeaderboardEntry = {
  rank: number
  address: string
  points: number
  nfts: number
  referrals: number
}

export default function LeaderboardPage() {
  const { connected } = useWallet()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in a real app, you would fetch this from an API
    const mockData: LeaderboardEntry[] = [
      { rank: 1, address: "0xfd5....b3c4", points: 1840, nfts: 1, referrals: 12 },
      { rank: 2, address: "0x124...64f9", points: 1570, nfts: 1, referrals: 10 },
      { rank: 3, address: "0x54a...2b7d", points: 1320, nfts: 1, referrals: 8 },
      { rank: 4, address: "0x3b2...c9e0", points: 1140, nfts: 1, referrals: 7 },
      { rank: 5, address: "0x9f1...e3a8", points: 980, nfts: 1, referrals: 6 },
      { rank: 6, address: "0x7d2...a1f5", points: 850, nfts: 1, referrals: 5 },
      { rank: 7, address: "0x2c3...d4e5", points: 720, nfts: 1, referrals: 4 },
      { rank: 8, address: "0xf1e...2d3c", points: 590, nfts: 1, referrals: 3 },
      { rank: 9, address: "0xa1b...c2d3", points: 460, nfts: 1, referrals: 2 },
      { rank: 10, address: "0xe4f...5g6h", points: 330, nfts: 1, referrals: 1 },
    ]

    setLeaderboard(mockData)
    setLoading(false)
  }, [])

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <NavBar />

        <div className="mt-12">
          <h1 className="text-4xl font-bold text-white mb-8">Leaderboard</h1>
          <p className="text-white/80 mb-8">
            Top performers in our community based on points earned through referrals and quests.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-2 text-white/70">Rank</th>
                    <th className="text-left py-4 px-2 text-white/70">Wallet</th>
                    <th className="text-right py-4 px-2 text-white/70">Points</th>
                    <th className="text-right py-4 px-2 text-white/70">NFTs</th>
                    <th className="text-right py-4 px-2 text-white/70">Referrals</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-4 px-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center 
                          ${
                            entry.rank === 1
                              ? "bg-[#00FFE0]"
                              : entry.rank === 2
                                ? "bg-[#FFC93C]"
                                : entry.rank === 3
                                  ? "bg-[#FF2263]"
                                  : "bg-white/20"
                          }`}
                        >
                          {entry.rank}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-white">{entry.address}</td>
                      <td className="py-4 px-2 text-right text-white font-bold">{entry.points}</td>
                      <td className="py-4 px-2 text-right text-white">{entry.nfts}</td>
                      <td className="py-4 px-2 text-right text-white">{entry.referrals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
