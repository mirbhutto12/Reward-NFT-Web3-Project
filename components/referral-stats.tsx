"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { generateReferralLink } from "@/lib/solana"

export function ReferralStats() {
  const { publicKey, usdcBalance } = useWallet()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [referralLink, setReferralLink] = useState("")

  // Generate referral link based on public key
  useEffect(() => {
    if (publicKey) {
      const link = generateReferralLink(publicKey)
      setReferralLink(link)
    } else {
      setReferralLink(`${window.location.origin}/ref/demo`)
    }
  }, [publicKey])

  // Mock stats - in a real app, these would be fetched from a database
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
    // First try to copy the referral link to clipboard as a fallback
    copyReferralLink()

    // Then try to use the Web Share API if available
    if (navigator.share) {
      try {
        navigator
          .share({
            title: "Join Reward NFT",
            text: "Mint exclusive NFTs on Solana and earn rewards!",
            url: referralLink,
          })
          .catch((error) => {
            // If sharing fails (user cancels or permission denied), we already copied to clipboard
            console.log("Share failed, but link was copied to clipboard:", error)
          })
      } catch (error) {
        console.error("Error sharing:", error)
        // We already copied to clipboard above, so no need for additional fallback
      }
    } else {
      // Web Share API not available, but we already copied to clipboard
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support sharing, but the link has been copied to your clipboard.",
      })
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
          <p className="text-4xl font-bold text-theme-teal">{totalPoints}</p>
          <p className="text-white/70 text-sm">Total Points</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-theme-yellow">{referredUsers}</p>
          <p className="text-white/70 text-sm">Referred Users</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold text-theme-pink">{rewardPerReferral} USDC</p>
          <p className="text-white/70 text-sm">per referral</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-medium">Available USDC Balance</p>
            <p className="text-2xl font-bold text-theme-teal">{usdcBalance.toFixed(2)} USDC</p>
          </div>
          <Button className="bg-theme-teal hover:bg-theme-teal/80 text-theme-dark">Withdraw</Button>
        </div>
      </div>

      <Button onClick={inviteFriends} className="w-full bg-theme-yellow hover:bg-theme-yellow/80 text-theme-dark py-6">
        Invite Friends
      </Button>
    </div>
  )
}
