"use client"

import { useSolanaWallet } from "@/hooks/use-solana-wallet"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function WalletStatusIndicator() {
  const { connected, connecting, publicKey } = useSolanaWallet()

  if (connecting) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Connecting
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connecting to wallet...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (connected && publicKey) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/50">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Connected to {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">
            <XCircle className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Wallet not connected</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
