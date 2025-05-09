import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getRpcUrl } from "./utils"

// Initialize connection to QuickNode RPC URL with sanitized URL
const connection = new Connection(getRpcUrl())

// Check if we're on devnet
const isDevnet = connection.rpcEndpoint.includes("devnet") || connection.rpcEndpoint.includes("quicknode")

// USDT token address - hardcoded for client-side use
// The actual value will be fetched from server when needed
// We'll use the server action when needed instead of storing the address here

// Default SOL price in USD (fallback value)
const DEFAULT_SOL_PRICE = 150

// Get SOL price - simplified version that doesn't rely on external APIs
export async function getSolPrice(): Promise<number> {
  try {
    // In a real app, you would fetch the price from an API
    // For the v0 environment, we'll just return a fixed price
    // to avoid CORS issues with external APIs
    return DEFAULT_SOL_PRICE
  } catch (error) {
    console.error("Error fetching SOL price:", error)
    return DEFAULT_SOL_PRICE // Fallback price
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

// Get USDT token balance (mock implementation)
export async function getUSDTBalance(walletAddress: string): Promise<number> {
  try {
    // In a real app, you would:
    // 1. Get the token address from the server
    // const tokenAddressStr = await getUsdtTokenAddress()
    // 2. Use it to fetch the actual token balance

    // For demo purposes, return a mock balance
    return 25.5
  } catch (error) {
    console.error("Error fetching USDT balance:", error)
    return 0
  }
}
