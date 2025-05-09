// Types
export type Referral = {
  id: string
  referrerAddress: string
  referredAddress: string
  timestamp: number
  status: "pending" | "completed"
  reward?: number
}

// Mock referral storage
const referrals: Referral[] = []

// Generate a unique referral link
export function generateReferralLink(walletAddress: string, code: string): string {
  return `${window.location.origin}/ref/${code}`
}

// Track a new referral
export async function trackReferral(referrerAddress: string, referredAddress: string): Promise<boolean> {
  try {
    // Check if this referral already exists
    const existingReferral = referrals.find(
      (ref) => ref.referrerAddress === referrerAddress && ref.referredAddress === referredAddress,
    )

    if (existingReferral) {
      console.log("Referral already exists")
      return false
    }

    // Create new referral
    const newReferral: Referral = {
      id: `ref-${Date.now().toString(36)}`,
      referrerAddress,
      referredAddress,
      timestamp: Date.now(),
      status: "pending",
    }

    // Add to storage
    referrals.push(newReferral)
    console.log("New referral tracked:", newReferral)

    return true
  } catch (error) {
    console.error("Error tracking referral:", error)
    return false
  }
}

// Complete a referral and assign reward
export async function completeReferral(referredAddress: string): Promise<boolean> {
  try {
    // Find the pending referral
    const referralIndex = referrals.findIndex(
      (ref) => ref.referredAddress === referredAddress && ref.status === "pending",
    )

    if (referralIndex === -1) {
      console.log("No pending referral found for this address")
      return false
    }

    // Update referral status and add reward
    referrals[referralIndex] = {
      ...referrals[referralIndex],
      status: "completed",
      reward: 2, // 2 USDT reward
    }

    console.log("Referral completed:", referrals[referralIndex])

    return true
  } catch (error) {
    console.error("Error completing referral:", error)
    return false
  }
}

// Get referrals for a wallet address
export async function getReferrals(walletAddress: string): Promise<Referral[]> {
  return referrals.filter((ref) => ref.referrerAddress === walletAddress)
}

// Get referral stats
export async function getReferralStats(walletAddress: string): Promise<{
  totalReferrals: number
  completedReferrals: number
  pendingReferrals: number
  totalRewards: number
}> {
  const userReferrals = await getReferrals(walletAddress)

  const completedReferrals = userReferrals.filter((ref) => ref.status === "completed")
  const pendingReferrals = userReferrals.filter((ref) => ref.status === "pending")
  const totalRewards = completedReferrals.reduce((sum, ref) => sum + (ref.reward || 0), 0)

  return {
    totalReferrals: userReferrals.length,
    completedReferrals: completedReferrals.length,
    pendingReferrals: pendingReferrals.length,
    totalRewards,
  }
}
