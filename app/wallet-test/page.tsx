"use client"

import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { checkEnvironmentVariables } from "@/lib/env-check"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function WalletTestPage() {
  const { connect, disconnect, connected, connecting, publicKey, wallet, wallets } = useWallet()

  const [envCheck, setEnvCheck] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkEnv() {
      try {
        const result = await checkEnvironmentVariables()
        setEnvCheck(result)
      } catch (error) {
        console.error("Error checking environment variables:", error)
        setEnvCheck({ error: "Failed to check environment variables" })
      } finally {
        setLoading(false)
      }
    }

    checkEnv()
  }, [])

  return (
    <main className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-8">
        <NavBar />

        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-3xl p-8">
          <h1 className="text-4xl font-bold text-white mb-8">Wallet Connection Test</h1>

          <div className="space-y-8">
            {/* Environment Variables Check */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Environment Variables</h2>

              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : envCheck?.error ? (
                <div className="bg-red-500/20 p-4 rounded-lg text-white">
                  <p className="font-medium">Error checking environment variables</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    {envCheck?.allSet ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    )}
                    <span className="text-white font-medium">
                      {envCheck?.allSet
                        ? "All environment variables are set"
                        : `Missing variables: ${envCheck?.missingVars.join(", ")}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <p className="text-white/70 text-sm">RPC URL</p>
                      <p className="text-white font-medium">{envCheck?.rpcUrl || "Not set"}</p>
                    </div>

                    <div className="bg-white/10 p-3 rounded-lg">
                      <p className="text-white/70 text-sm">USDT Token Address</p>
                      <p className="text-white font-medium">{envCheck?.usdtAddress || "Not set"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Connection Status */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Wallet Connection</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  {connected ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-white font-medium">{connected ? "Connected" : "Not connected"}</span>
                </div>

                {connected && publicKey && (
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-white/70 text-sm">Wallet Address</p>
                    <p className="text-white font-medium break-all">{publicKey}</p>
                  </div>
                )}

                {wallet && (
                  <div className="bg-white/10 p-3 rounded-lg">
                    <p className="text-white/70 text-sm">Connected Wallet</p>
                    <p className="text-white font-medium">{wallet}</p>
                  </div>
                )}

                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-white/70 text-sm">Available Wallets</p>
                  {wallets.length > 0 ? (
                    <ul className="text-white mt-1 space-y-1">
                      {wallets.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white">No wallets available</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={connect}
                    disabled={connecting || connected}
                    className="bg-theme-teal text-theme-dark hover:bg-theme-teal/80"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect Wallet"
                    )}
                  </Button>

                  <Button
                    onClick={disconnect}
                    disabled={!connected}
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>

            {/* Browser Information */}
            <div className="bg-white/5 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">Browser Information</h2>

              <div className="space-y-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-white/70 text-sm">User Agent</p>
                  <p className="text-white text-sm break-all">{navigator.userAgent}</p>
                </div>

                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-white/70 text-sm">Platform</p>
                  <p className="text-white">{navigator.platform}</p>
                </div>

                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-white/70 text-sm">Window Dimensions</p>
                  <p className="text-white">
                    {window.innerWidth} x {window.innerHeight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
