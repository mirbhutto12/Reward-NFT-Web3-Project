"use client"

import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

export function useWallet() {
  // Safely access the wallet adapter
  const solanaWallet = useSolanaWallet()
  const { toast } = useToast()

  // State for our custom wallet modal
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  // Default values for when wallet adapter isn't available
  const [fallbackConnected, setFallbackConnected] = useState(false)
  const [fallbackConnecting, setFallbackConnecting] = useState(false)

  // Mock balances for development
  const [solBalance, setSolBalance] = useState(5.0)
  const [usdtBalance, setUsdtBalance] = useState(25.5)

  // Add this after the state declarations
  useEffect(() => {
    // Check if we have a stored connection state
    const checkStoredConnection = async () => {
      try {
        const storedConnection = localStorage.getItem("walletConnected")
        const storedWallet = localStorage.getItem("lastConnectedWallet")

        if (storedConnection === "true" && storedWallet) {
          // If we have a stored connection, try to reconnect
          console.log("Found stored wallet connection, attempting to reconnect")

          // If wallet adapter is already connected, update our state
          if (solanaWallet.connected && solanaWallet.publicKey) {
            console.log("Wallet already connected via adapter")
          } else {
            // Try to select the last connected wallet
            if (solanaWallet.select && storedWallet) {
              solanaWallet.select(storedWallet)
            }
          }
        }
      } catch (error) {
        console.error("Error checking stored connection:", error)
      }
    }

    checkStoredConnection()
  }, [])

  // Update connection status when wallet changes
  useEffect(() => {
    if (solanaWallet.connected && isWalletModalOpen) {
      setIsWalletModalOpen(false)
      toast({
        title: "Wallet connected",
        description: `Connected to ${solanaWallet.publicKey?.toString().slice(0, 4)}...${solanaWallet.publicKey?.toString().slice(-4)}`,
      })
    }
  }, [solanaWallet.connected, isWalletModalOpen, toast, solanaWallet.publicKey])

  // Safe connect function that works even if wallet adapter isn't fully initialized
  const connect = useCallback(async () => {
    try {
      setFallbackConnecting(true)

      // Check if a wallet is already selected
      if (solanaWallet.wallet) {
        try {
          console.log("Wallet already selected, attempting to connect...")
          await solanaWallet.connect().catch((err) => {
            console.error("Error connecting to selected wallet:", err)
            // Check error message instead of type
            if (!(err.message && err.message.includes("Wallet not selected"))) {
              throw err
            }
          })

          // Store connection state
          localStorage.setItem("walletConnected", "true")
          if (solanaWallet.wallet.adapter.name) {
            localStorage.setItem("lastConnectedWallet", solanaWallet.wallet.adapter.name)
          }

          return true
        } catch (error) {
          console.error("Failed to connect to selected wallet:", error)
          // Continue to open the modal if connection fails
        }
      }

      // Open our custom wallet modal if no wallet is selected or connection failed
      console.log("Opening wallet selection modal...")
      setIsWalletModalOpen(true)
      return true
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setFallbackConnecting(false)
    }
  }, [solanaWallet, toast])

  // Safe disconnect function
  const disconnect = useCallback(async () => {
    try {
      if (solanaWallet && solanaWallet.disconnect) {
        await solanaWallet.disconnect()
      }
      setFallbackConnected(false)

      // Clear stored connection state
      localStorage.removeItem("walletConnected")
      localStorage.removeItem("lastConnectedWallet")

      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected.",
      })
    } catch (error) {
      console.error("Disconnect error:", error)
    }
  }, [solanaWallet, toast])

  // Return either the real wallet values or fallbacks
  return {
    publicKey: solanaWallet?.publicKey?.toString() || null,
    connected: solanaWallet?.connected || fallbackConnected,
    connecting: solanaWallet?.connecting || fallbackConnecting,
    connect,
    disconnect,
    solBalance,
    usdtBalance,
    // Add other properties with safe fallbacks
    wallet: solanaWallet?.wallet?.adapter.name || null,
    wallets: solanaWallet?.wallets?.map((w) => w.adapter.name) || [],
    select: solanaWallet?.select || (() => {}),
    signMessage: async () => null,
    signTransaction: async () => null,
    sendTransaction: async () => ({ signature: "" }),
    isMobile: false,
    isDevnet: true,
    solPrice: 150,
    // Custom wallet modal state
    isWalletModalOpen,
    setIsWalletModalOpen,
  }
}
