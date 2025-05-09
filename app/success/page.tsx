"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Check, Share2, Copy, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function SuccessPage() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Mock transaction ID
  const txId = "5UxV2MR7P5MCoGfKDv7jJZt84zqJuBdtzBhXjuW1Rvij"

  // Replace this line:
  // const referralLink = `${window.location.origin}/mint?ref=abc123`

  // With this code that safely handles server-side rendering:
  const [referralLink, setReferralLink] = useState("https://example.com/mint?ref=abc123")

  // Add this useEffect to update the referral link on the client side
  useEffect(() => {
    // This will only run in the browser
    setReferralLink(`${window.location.origin}/mint?ref=abc123`)
  }, [])

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)

    toast({
      title: "Referral link copied!",
      description: "Share it with your friends to earn rewards",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnTwitter = () => {
    const text = "I just minted my exclusive identity NFT on Reward NFT! Join me and earn rewards on Solana."
    const url = referralLink
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <NavBar />

        <div className="mt-12 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Congratulations!</h1>
          <p className="text-white/90 text-xl mb-12">You've successfully minted your exclusive identity NFT</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
              <div className="relative w-full aspect-square mb-4">
                <Image src="/images/nft-character.png" alt="Exclusive NFT Character" fill className="object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Exclusive Identity NFT</h2>
              <p className="text-white/90 mb-4 text-sm">
                Transaction ID: {txId.slice(0, 8)}...{txId.slice(-8)}
              </p>
              <Link href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`} target="_blank">
                <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                  View on Explorer
                </Button>
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left hover:bg-white/20 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-4">Share & Earn</h2>
              <p className="text-white/90 mb-6">
                Share your referral link with friends and earn 4 USDC for each friend who mints an NFT!
              </p>

              <div className="flex items-center mb-6">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-white/10 border border-white/20 rounded-l-md py-2 px-3 text-white"
                />
                <button className="bg-white text-[#001F2B] py-2 px-4 rounded-r-md" onClick={copyReferralLink}>
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-white text-[#001F2B] hover:bg-white/90" onClick={copyReferralLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button className="bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/80" onClick={shareOnTwitter}>
                  <Twitter className="mr-2 h-4 w-4" />
                  Share on Twitter
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="bg-white text-[#001F2B] hover:bg-white/90">Back to Home</Button>
            </Link>
            <Link href="/referrals">
              <Button className="bg-white text-[#001F2B] hover:bg-white/90">
                <Share2 className="mr-2 h-4 w-4" />
                View Referrals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
