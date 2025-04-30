"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { getRecentTransactions, type TransactionInfo } from "@/lib/transaction-monitor"
import { Loader2, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecentTransactions() {
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<TransactionInfo[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTransactions = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const txs = await getRecentTransactions(publicKey)
      setTransactions(txs)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (publicKey) {
      fetchTransactions()
    }
  }, [publicKey])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getExplorerUrl = (signature: string) => {
    const baseUrl = "https://explorer.solana.com/tx"
    const cluster = "devnet" // Change to "mainnet-beta" for mainnet
    return `${baseUrl}/${signature}?cluster=${cluster}`
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Recent Transactions</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchTransactions}
          disabled={loading || !publicKey}
          className="text-white border-white/20 hover:bg-white/10"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.signature} className="bg-white/5 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    {tx.success ? (
                      <CheckCircle className="h-4 w-4 text-theme-teal" />
                    ) : (
                      <XCircle className="h-4 w-4 text-theme-pink" />
                    )}
                    <span className="text-white font-medium">{tx.type || "Transaction"}</span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">{formatDate(tx.timestamp)}</p>
                </div>
                <a
                  href={getExplorerUrl(tx.signature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-teal hover:text-theme-teal/80 flex items-center gap-1"
                >
                  <span className="text-sm">View</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-white/70">
          {publicKey ? "No recent transactions found" : "Connect your wallet to view transactions"}
        </div>
      )}
    </div>
  )
}
