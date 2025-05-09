"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/providers/wallet-provider"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { generateReferralCode, formatWalletAddress } from "@/lib/utils"
import { generateReferralLink, getReferralStats } from "@/lib/referral-service"
import { Copy, Share2, CheckCircle } from "lucide-react"

interface ReferralSystemProps {
  className?: string
}

export function ReferralSystem({ className }: ReferralSystemProps) {
  const { connected, publicKey } = useWallet()
  const { toast } = useToast()
  const [referralCode, setReferralCode] = useState("")
  const [referralLink, setReferralLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      // Generate referral code based on wallet address
      const code = generateReferralCode(publicKey)
      setReferralCode(code)

      // Generate referral link
      const link = generateReferralLink(publicKey, code)
      setReferralLink(link)

      // Load referral stats
      loadReferralStats()
    } else {
      setReferralCode("")
      setReferralLink("")
      setStats({
        totalReferrals: 0,
        completedReferrals: 0,
        pendingReferrals: 0,
        totalRewards: 0,
      })
    }
  }, [connected, publicKey])

  const loadReferralStats = async () => {
    if (!connected || !publicKey) return

    setLoading(true)
    try {
      const stats = await getReferralStats(publicKey)
      setStats(stats)
    } catch (error) {
      console.error("Error loading referral stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)

    toast({
      title: "Referral link copied!",
      description: "Share it with your friends to earn rewards",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join and mint an exclusive NFT!",
          text: "Use my referral link to join and mint an exclusive NFT!",
          url: referralLink,
        })

        toast({
          title: "Referral link shared!",
          description: "Thanks for sharing!",
        })
      } catch (error) {
        console.error("Error sharing:", error)

        // Fallback to copy
        copyReferralLink()
      }
    } else {
      // Fallback to copy
      copyReferralLink()
    }
  }

  if (!connected) {
    return (
      <div className={`p-4 bg-white/10 rounded-lg ${className}`}>
        <h3 className="text-lg font-medium mb-2">Referral Program</h3>
        <p className="text-sm mb-4">Connect your wallet to access the referral program</p>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-white/10 rounded-lg ${className}`}>
      <h3 className="text-lg font-medium mb-2">Referral Program</h3>
      <p className="text-sm mb-4">
        Share your referral link with friends. You'll earn 2 USDT for each friend who mints an NFT using your link!
      </p>

      <div className="mb-4">
        <label className="text-sm text-white/70 mb-1 block">Your Referral Link</label>
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="bg-white/10 text-white border-white/20" />
          <Button
            onClick={copyReferralLink}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
            size="icon"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            onClick={shareReferralLink}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
            size="icon"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-[#00FFE0]">{stats.totalReferrals}</p>
          <p className="text-xs text-white/70">Total Referrals</p>
        </div>
        <div className="bg-white/5 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-[#FFC93C]">{stats.totalRewards}</p>
          <p className="text-xs text-white/70">USDT Earned</p>
        </div>
      </div>

      <div className="text-sm">
        <p className="flex justify-between py-1 border-b border-white/10">
          <span className="text-white/70">Completed Referrals:</span>
          <span>{stats.completedReferrals}</span>
        </p>
        <p className="flex justify-between py-1 border-b border-white/10">
          <span className="text-white/70">Pending Referrals:</span>
          <span>{stats.pendingReferrals}</span>
        </p>
        <p className="flex justify-between py-1">
          <span className="text-white/70">Your Wallet:</span>
          <span>{formatWalletAddress(publicKey)}</span>
        </p>
      </div>
    </div>
  )
}
