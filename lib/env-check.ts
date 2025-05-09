"use server"

/**
 * Utility function to check if environment variables are correctly set
 */
export async function checkEnvironmentVariables() {
  const envVars = {
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    NFT_IPFS_URL: process.env.NFT_IPFS_URL,
    USDT_TOKEN_ADDRESS: process.env.USDT_TOKEN_ADDRESS,
  }

  const missingVars = Object.entries(envVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  return {
    allSet: missingVars.length === 0,
    missingVars,
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL
      ? `${process.env.NEXT_PUBLIC_SOLANA_RPC_URL.substring(0, 20)}...`
      : null,
    usdtAddress: process.env.USDT_TOKEN_ADDRESS,
  }
}
