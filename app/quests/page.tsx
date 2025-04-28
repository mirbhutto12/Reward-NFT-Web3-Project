"use client"

import { NavBar } from "@/components/nav-bar"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function QuestsPage() {
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
          <h1 className="text-6xl font-bold text-white mb-8">Quests</h1>
          <p className="text-xl text-white mb-8">Complete quests to earn points and unlock rewards</p>

          <div className="grid gap-6">
            <QuestCard
              title="Daily Login"
              description="Log in to the app every day"
              reward="5 points"
              completed={true}
            />
            <QuestCard
              title="Mint Your First NFT"
              description="Mint your first NFT on our platform"
              reward="20 points"
              completed={true}
            />
            <QuestCard
              title="Refer 5 Friends"
              description="Get 5 friends to join using your referral link"
              reward="50 points"
              completed={false}
              progress="3/5"
            />
            <QuestCard
              title="Follow on Twitter"
              description="Follow our official Twitter account"
              reward="10 points"
              completed={false}
            />
            <QuestCard
              title="Join Discord"
              description="Join our Discord community"
              reward="10 points"
              completed={false}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

function QuestCard({
  title,
  description,
  reward,
  completed,
  progress,
}: {
  title: string
  description: string
  reward: string
  completed: boolean
  progress?: string
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/70 mb-2">{description}</p>
          <p className="text-white font-medium">Reward: {reward}</p>
          {progress && <p className="text-white/70 mt-2">Progress: {progress}</p>}
        </div>
        <div className="ml-4">
          {completed ? (
            <div className="bg-green-500 text-white rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-check"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          ) : (
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2">Complete</button>
          )}
        </div>
      </div>
    </div>
  )
}
