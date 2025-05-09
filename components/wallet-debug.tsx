"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function WalletDebug() {
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({})
  const { toast } = useToast()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    // Check for wallet providers
    const win = window as any
    const walletInfo = {
      timestamp: new Date().toISOString(),
      hasPhantom: !!win.phantom,
      hasPhantomSolana: !!win.phantom?.solana,
      hasSolana: !!win.solana,
      hasSolanaIsPhantom: !!win.solana?.isPhantom,
      hasSolflare: !!win.solflare,
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    }

    setDebugInfo(walletInfo)

    // Log to console for easier debugging
    console.log("Wallet Debug Info:", walletInfo)
  }, [])

  const copyDebugInfo = () => {
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
    toast({
      title: "Debug info copied",
      description: "Wallet debug information has been copied to clipboard",
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end">
        {expanded && (
          <div className="bg-black/80 text-white p-4 rounded-lg mb-2 max-w-md text-xs font-mono overflow-auto max-h-60">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            <Button variant="outline" size="sm" onClick={copyDebugInfo} className="mt-2 text-xs">
              Copy Debug Info
            </Button>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="bg-black/80 text-white border-white/20 hover:bg-black/60"
        >
          {expanded ? "Hide Wallet Debug" : "Show Wallet Debug"}
        </Button>
      </div>
    </div>
  )
}
