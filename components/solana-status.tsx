"use client"

import { useState, useEffect } from "react"
import { checkSolanaConnection, type SolanaStatus } from "@/lib/solana-status"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getRpcUrl } from "@/lib/utils"

export function SolanaStatus() {
  const [status, setStatus] = useState<SolanaStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const rpcUrl = getRpcUrl()

  const checkStatus = async () => {
    setLoading(true)
    try {
      const status = await checkSolanaConnection(rpcUrl)
      setStatus(status)
    } catch (error) {
      console.error("Error checking Solana status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()

    // Check status every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-white">Solana Network Status</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          disabled={loading}
          className="text-white border-white/20 hover:bg-white/10"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      {status ? (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Connection:</span>
            <span className={`font-medium ${status.connected ? "text-theme-teal" : "text-theme-pink"}`}>
              {status.connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {status.connected && (
            <>
              <div className="flex justify-between">
                <span className="text-white/70">Network:</span>
                <span className="text-white font-medium">
                  {rpcUrl.includes("devnet") || rpcUrl.includes("quicknode") ? "Devnet" : "Mainnet"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">Current Slot:</span>
                <span className="text-white font-medium">{status.slot}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">Block Height:</span>
                <span className="text-white font-medium">{status.blockHeight}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/70">Latency:</span>
                <span className="text-white font-medium">{status.latency}ms</span>
              </div>
            </>
          )}

          {!status.connected && status.error && <div className="text-theme-pink">{status.error}</div>}
        </div>
      ) : (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      )}
    </div>
  )
}
