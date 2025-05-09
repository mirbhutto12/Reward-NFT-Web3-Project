"use server"

/**
 * Server action to safely fetch the USDT token address
 * This keeps the environment variable on the server side
 */
export async function getUsdtTokenAddress(): Promise<string> {
  // Return the environment variable from the server
  // If not available, return a default value
  return process.env.USDT_TOKEN_ADDRESS || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
}
