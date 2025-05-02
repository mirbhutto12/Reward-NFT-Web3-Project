"use server"

import { Connection } from "@solana/web3.js"
import { sanitizeUrl } from "./utils"

export async function getSolanaConnection(): Promise<Connection> {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
  if (!rpcUrl) {
    throw new Error("RPC URL not defined in environment variables")
  }

  const connection = new Connection(sanitizeUrl(rpcUrl))
  return connection
}

export async function getCurrentSlot(): Promise<number> {
  try {
    const connection = await getSolanaConnection()
    const slot = await connection.getSlot()
    return slot
  } catch (error) {
    console.error("Error getting current slot:", error)
    return 0
  }
}

// Server action to get the USDC token address
export async function getUsdcTokenAddress(): Promise<string> {
  // Use the environment variable on the server side
  return process.env.USDC_TOKEN_ADDRESS || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
}

// Server action to get the NFT IPFS URL
export async function getNftIpfsUrl(): Promise<string> {
  return (
    process.env.NFT_IPFS_URL ||
    "https://quicknode.quicknode-ipfs.com/ipfs/QmWrmCfPm6L85p1o8KMc9WZCsdwsgW89n37nQMJ6UCVYNW"
  )
}
