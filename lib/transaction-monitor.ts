import { Connection, PublicKey, type ConfirmedSignatureInfo } from "@solana/web3.js"
import { getRpcUrl } from "./utils"

export type TransactionInfo = {
  signature: string
  timestamp: number
  slot: number
  success: boolean
  blockTime?: number
  memo?: string
  type?: string
}

export async function getRecentTransactions(walletAddress: string, limit = 10): Promise<TransactionInfo[]> {
  try {
    const connection = new Connection(getRpcUrl())

    const publicKey = new PublicKey(walletAddress)

    // Get recent transaction signatures
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit })

    // Process transaction data
    const transactions: TransactionInfo[] = signatures.map((sig: ConfirmedSignatureInfo) => {
      // Determine transaction type based on available data
      let type = "Unknown"
      if (sig.memo) {
        if (sig.memo.includes("mint")) type = "NFT Mint"
        else if (sig.memo.includes("transfer")) type = "Transfer"
        else if (sig.memo.includes("reward")) type = "Reward"
      }

      return {
        signature: sig.signature,
        timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
        slot: sig.slot,
        success: sig.err === null,
        blockTime: sig.blockTime,
        memo: sig.memo,
        type,
      }
    })

    return transactions
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    return []
  }
}
