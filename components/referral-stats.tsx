"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

export function ReferralStats() {
  const { publicKey } = useWallet()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Generate referral link based on public key
  const referralLink = publicKey ? `https://rewardnft.com/ref${publicKey.slice(0, 3)}` : "https://rewardnft.com/ref123"

  // Mock stats
  const totalPoints = 126
  const referredUsers = 15
  const rewardPerReferral = 2 // USDC

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)

    toast({
      title: "Referral link copied!",
      description: "Share it with your friends to earn rewards.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const inviteFriends = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: "Join Reward NFT",
        text: "Mint exclusive NFTs on Solana and earn rewards!",
        url: referralLink,
      })
    } else {
      copyReferralLink()
    }
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <p className="text-white mb-2">Referral link</p>
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="bg-white/10 text-white border-white/20" />
          <Button onClick={copyReferralLink} variant="outline" className="text-white border-white/20 hover:bg-white/10">
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-white">{totalPoints}</p>
          <p className="text-white/70 text-sm">Total Points</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-white">{referredUsers}</p>
          <p className="text-white/70 text-sm">Referred Users</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-white">{rewardPerReferral} USDC</p>
          <p className="text-white/70 text-sm">per referral</p>
        </div>
      </div>

      <Button onClick={inviteFriends} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6">
        Invite Friends
      </Button>
    </div>
  )
}
