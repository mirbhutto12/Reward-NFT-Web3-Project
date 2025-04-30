import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getRpcUrl } from "./utils"

// Initialize connection to QuickNode RPC URL with sanitized URL
const connection = new Connection(getRpcUrl())

// Check if we're on devnet
const isDevnet = connection.rpcEndpoint.includes("devnet") || connection.rpcEndpoint.includes("quicknode")

// USDC token address - hardcoded for client-side use
// The actual value will be fetched from server when needed
const USDC_TOKEN_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

// Default SOL price in USD (fallback value)
const DEFAULT_SOL_PRICE = 150

// Cache for SOL price to reduce API calls
let solPriceCache = {
  price: DEFAULT_SOL_PRICE,
  timestamp: 0,
  ttl: 5 * 60 * 1000, // 5 minutes cache TTL
}

// Get SOL price from an API with improved error handling and caching
export async function getSolPrice(): Promise<number> {
  try {
    // Check if we have a valid cached price
    const now = Date.now()
    if (now - solPriceCache.timestamp < solPriceCache.ttl) {
      return solPriceCache.price
    }

    // Try multiple price sources for redundancy
    const sources = [
      {
        url: "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
        parser: (data: any) => data.solana?.usd,
      },
      {
        url: "https://price.jup.ag/v4/price?ids=SOL",
        parser: (data: any) => data.data?.SOL?.price,
      },
    ]

    // Try each source until we get a valid price
    for (const source of sources) {
      try {
        const response = await fetch(source.url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-cache", // Ensure we're not getting cached responses
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        const price = source.parser(data)

        if (price && typeof price === "number" && price > 0) {
          // Update cache
          solPriceCache = {
            price,
            timestamp: now,
            ttl: solPriceCache.ttl,
          }
          return price
        }
      } catch (sourceError) {
        console.warn(`Error fetching SOL price from ${source.url}:`, sourceError)
        // Continue to next source
      }
    }

    // If we reach here, all sources failed but we might have a stale cache
    if (solPriceCache.price > 0) {
      console.warn("Using stale SOL price from cache")
      return solPriceCache.price
    }

    // All sources failed and no valid cache, use default
    console.warn("All price sources failed, using default SOL price")
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

// Get USDC token balance (mock implementation)
export async function getUSDCBalance(walletAddress: string): Promise<number> {
  try {
    // In a real app, you would fetch the actual token balance
    // For demo purposes, return a mock balance
    return 25.5
  } catch (error) {
    console.error("Error fetching USDC balance:", error)
    return 0
  }
}
