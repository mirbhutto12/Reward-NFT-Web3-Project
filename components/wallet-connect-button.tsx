"use client"

import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/hooks/use-solana-wallet"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface WalletConnectButtonProps {
  className?: string
}

export function WalletConnectButton({ className }: WalletConnectButtonProps) {
  const { connected, connecting, connect, disconnect, publicKey, isMobile } = useSolanaWallet()
  const { toast } = useToast()
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [connectionAttemptTime, setConnectionAttemptTime] = useState<number | null>(null)

  // Handle reconnection attempts when returning from a wallet app on mobile
  useEffect(() => {
    if (!isMobile) return

    // Check if we're returning from a wallet app
    const checkReturnFromWallet = () => {
      const storedAttemptTime = sessionStorage.getItem("walletConnectionAttempt")

      if (storedAttemptTime && !connected && !connecting) {
        const attemptTime = Number.parseInt(storedAttemptTime, 10)
        const currentTime = Date.now()

        // If it's been less than 5 minutes since the connection attempt
        if (currentTime - attemptTime < 5 * 60 * 1000) {
          setIsReconnecting(true)

          // Try to reconnect
          connect()

          // Clear the stored attempt time
          sessionStorage.removeItem("walletConnectionAttempt")
          setIsReconnecting(false)
        } else {
          // Clear stale connection attempts
          sessionStorage.removeItem("walletConnectionAttempt")
        }
      }
    }

    // Check when the document becomes visible again (user returns from wallet app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkReturnFromWallet()
      }
    }

    // Check when the window gets focus
    const handleFocus = () => {
      checkReturnFromWallet()
    }

    // Initial check (in case we're already returning from a wallet)
    checkReturnFromWallet()

    // Set up event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
    }
  }, [isMobile, connected, connecting, connect])

  const handleConnect = () => {
    if (isMobile) {
      // Store the connection attempt time
      sessionStorage.setItem("walletConnectionAttempt", Date.now().toString())
      setConnectionAttemptTime(Date.now())
    }

    connect()
  }

  const handleDisconnect = () => {
    disconnect()
    sessionStorage.removeItem("walletConnectionAttempt")
    setConnectionAttemptTime(null)
  }

  // If we're connected, show the disconnect button
  if (connected && publicKey) {
    return (
      <Button
        variant="outline"
        className={`text-white border-white hover:bg-white/10 ${className}`}
        onClick={handleDisconnect}
      >
        Disconnect
      </Button>
    )
  }

  // If we're connecting or reconnecting, show a loading state
  if (connecting || isReconnecting) {
    return (
      <Button className={`bg-[#00FFE0] text-[#001F2B] hover:bg-opacity-80 ${className}`} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  // Otherwise, show the connect button
  return (
    <Button className={`bg-[#00FFE0] text-[#001F2B] hover:bg-opacity-80 ${className}`} onClick={handleConnect}>
      Connect Wallet
    </Button>
  )
}
