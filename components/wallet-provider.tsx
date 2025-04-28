"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"

type WalletContextType = {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
}

export const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  publicKey: null,
  balance: 0,
  connect: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)

  // Check if wallet was previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet")
    if (savedWallet) {
      setConnected(true)
      setPublicKey(savedWallet)
      setBalance(5.0) // Mock balance for demo
    }
  }, [])

  const connect = async () => {
    try {
      setConnecting(true)

      // Check if Phantom is installed
      const isPhantomInstalled = window.phantom?.solana?.isPhantom

      if (!isPhantomInstalled) {
        alert("Phantom wallet is not installed. Please install it to continue.")
        window.open("https://phantom.app/", "_blank")
        return
      }

      // Connect to Phantom wallet
      // In a real app, we would use the Solana wallet adapter
      // This is a simplified mock for demonstration
      const mockPublicKey = "7KBfA6xhpuEYnxVK7eLzwLKPG1GQDgZxQ9KRhSHJvTJE"

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setConnected(true)
      setPublicKey(mockPublicKey)
      setBalance(5.0) // Mock balance

      // Save connection state
      localStorage.setItem("wallet", mockPublicKey)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect wallet. Please try again.")
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    setConnected(false)
    setPublicKey(null)
    setBalance(0)
    localStorage.removeItem("wallet")
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        publicKey,
        balance,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
