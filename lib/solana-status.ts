import { Connection } from "@solana/web3.js"
import { getRpcUrl } from "./utils"

export type SolanaStatus = {
  connected: boolean
  slot?: number
  blockHeight?: number
  version?: string
  error?: string
  latency?: number
}

export async function checkSolanaConnection(rpcUrl?: string): Promise<SolanaStatus> {
  try {
    const url = rpcUrl || getRpcUrl()
    const startTime = performance.now()
    const connection = new Connection(url)

    // Get the current slot number
    const slot = await connection.getSlot()

    // Get additional network information
    const blockHeight = await connection.getBlockHeight()
    const version = await connection.getVersion()

    // Calculate latency
    const endTime = performance.now()
    const latency = Math.round(endTime - startTime)

    return {
      connected: true,
      slot,
      blockHeight,
      version: version["solana-core"],
      latency,
    }
  } catch (error) {
    console.error("Error connecting to Solana:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
