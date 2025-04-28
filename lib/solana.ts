import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

// Initialize connection to devnet
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com")

// Check if we're on devnet
const isDevnet = connection.rpcEndpoint.includes("devnet")

// Get SOL price from an API
export async function getSolPrice(): Promise<number> {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")
    const data = await response.json()
    return data.solana.usd
  } catch (error) {
    console.error("Error fetching SOL price:", error)
    return 150 // Fallback price
  }
}

// Calculate mint price in SOL based on USD price
export async function calculateMintPriceInSol(usdPrice: number): Promise<number> {
  const solPrice = await getSolPrice()
  return usdPrice / solPrice
}

// Mint NFT
export async function mintNFT(
  walletAddress: string,
  mintPriceSOL: number,
): Promise<{ success: boolean; txId?: string; error?: string }> {
  try {
    // In a production app, this would interact with a Solana program
    // to mint an NFT and charge the user

    // For demonstration purposes, we'll simulate a successful mint
    // In a real implementation, you would:
    // 1. Create a new token mint
    // 2. Create a token account for the user
    // 3. Mint a token to the user's account
    // 4. Charge the user the mint price

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return a mock transaction ID
    return {
      success: true,
      txId: "5UxV2MR7P5MCoGfKDv7jJZt84zqJuBdtzBhXjuW1Rvij",
    }
  } catch (error) {
    console.error("Error minting NFT:", error)
    return {
      success: false,
      error: "Failed to mint NFT. Please try again.",
    }
  }
}

// Generate referral link
export function generateReferralLink(walletAddress: string): string {
  return `${window.location.origin}/ref/${walletAddress.slice(0, 8)}`
}

// Track referral
export async function trackReferral(referralCode: string, newUserAddress: string): Promise<boolean> {
  try {
    // In a real app, this would track a referral in a database
    // and reward the referrer

    // For demonstration purposes, we'll simulate a successful referral
    return true
  } catch (error) {
    console.error("Error tracking referral:", error)
    return false
  }
}

// Request airdrop (for devnet testing)
export async function requestAirdrop(walletAddress: string, amount = 0.01): Promise<boolean> {
  try {
    // Check if we're on devnet
    if (!isDevnet) {
      console.warn("Airdrops are only available on devnet")
      return false
    }

    const publicKey = new PublicKey(walletAddress)
    const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL)

    await connection.confirmTransaction(signature)
    return true
  } catch (error) {
    console.error("Error requesting airdrop:", error)
    return false
  }
}
