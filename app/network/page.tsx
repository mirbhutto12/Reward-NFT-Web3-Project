"use client"

import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { SolanaStatus } from "@/components/solana-status"
import { RecentTransactions } from "@/components/recent-transactions"
import { RpcEndpoints } from "@/components/rpc-endpoints"
import { NetworkAlerts } from "@/components/network-alerts"
import { Connection } from "@solana/web3.js"
import { Loader2 } from "lucide-react"
import { getRpcUrl } from "@/lib/utils"

export default function NetworkPage() {
  const [tps, setTps] = useState<number | null>(null)
  const [epochInfo, setEpochInfo] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const rpcUrl = getRpcUrl()

  const fetchNetworkStats = async () => {
    try {
      setLoading(true)
      const connection = new Connection(rpcUrl)

      // Get performance samples to calculate TPS
      const perfSamples = await connection.getRecentPerformanceSamples(10)
      if (perfSamples.length > 0) {
        const totalTxns = perfSamples.reduce((acc, sample) => acc + sample.numTransactions, 0)
        const totalSeconds = perfSamples.reduce((acc, sample) => acc + sample.samplePeriodSecs, 0)
        const calculatedTps = totalTxns / totalSeconds
        setTps(Math.round(calculatedTps * 100) / 100)
      }

      // Get epoch info
      const epochInfoData = await connection.getEpochInfo()
      setEpochInfo(epochInfoData)
    } catch (error) {
      console.error("Error fetching network stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNetworkStats()

    // Refresh every minute
    const interval = setInterval(fetchNetworkStats, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 pb-8">
        <NavBar />

        <div className="mt-8">
          <h1 className="text-6xl font-bold text-white mb-8">Network Health</h1>

          <NetworkAlerts />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <SolanaStatus />

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 hover:bg-white/20 transition-colors">
                <h3 className="text-lg font-medium text-white mb-4">Performance Metrics</h3>

                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-colors">
                      <p className="text-white/90 text-sm">Transactions Per Second</p>
                      <p className="text-3xl font-bold text-white mt-2">{tps !== null ? tps : "N/A"}</p>
                    </div>

                    <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-colors">
                      <p className="text-white/90 text-sm">Current Epoch</p>
                      <p className="text-3xl font-bold text-white mt-2">{epochInfo ? epochInfo.epoch : "N/A"}</p>
                    </div>

                    {epochInfo && (
                      <>
                        <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-colors">
                          <p className="text-white/90 text-sm">Epoch Progress</p>
                          <p className="text-3xl font-bold text-white mt-2">
                            {Math.round((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100)}%
                          </p>
                        </div>

                        <div className="bg-white/10 p-4 rounded-lg text-center hover:bg-white/20 transition-colors">
                          <p className="text-white/90 text-sm">Slots in Epoch</p>
                          <p className="text-3xl font-bold text-white mt-2">
                            {epochInfo.slotIndex} / {epochInfo.slotsInEpoch}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <RecentTransactions />
            </div>

            <div>
              <RpcEndpoints />

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 hover:bg-white/20 transition-colors">
                <h3 className="text-lg font-medium text-white mb-4">Network Information</h3>

                <div className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors">
                    <p className="text-white/90 mb-1">RPC Endpoint</p>
                    <p className="text-white break-all text-sm">{rpcUrl}</p>
                  </div>

                  <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors">
                    <p className="text-white/90 mb-1">Network</p>
                    <p className="text-white">
                      {rpcUrl.includes("devnet") || rpcUrl.includes("quicknode") ? "Devnet" : "Mainnet"}
                    </p>
                  </div>

                  <div className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition-colors">
                    <p className="text-white/90 mb-1">Explorer</p>
                    <a
                      href={`https://explorer.solana.com/?cluster=${rpcUrl.includes("devnet") || rpcUrl.includes("quicknode") ? "devnet" : "mainnet-beta"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline"
                    >
                      Open Solana Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
