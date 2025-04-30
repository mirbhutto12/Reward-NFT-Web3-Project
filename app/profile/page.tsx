"use client"

import { NavBar } from "@/components/nav-bar"
import { ProfileHeader } from "@/components/profile-header"
import { NftGallery } from "@/components/nft-gallery"
import { SolanaStatus } from "@/components/solana-status"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
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
        <div className="mt-8">
          <h1 className="text-6xl font-bold text-white mb-12">Profile</h1>
          <ProfileHeader />
          <div className="mb-8">
            <SolanaStatus />
          </div>
          <NftGallery />
        </div>
        <footer className="text-center text-white mt-8">
          <p>Powered by Reward NFT</p>
        </footer>
      </div>
    </main>
  )
}
