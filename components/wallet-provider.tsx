"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"

type PhantomEvent = "connect" | "disconnect" | "accountChanged"

interface PhantomProvider {
  connect: () => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  on: (event: PhantomEvent, callback: (args: any) => void) => void
  isPhantom: boolean
  publicKey: PublicKey
}

type WindowWithSolana = Window & {
  solana?: PhantomProvider
  phantom?: {
    solana?: PhantomProvider
  }
}

type WalletContextType = {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
  solPrice: number
  isDevnet: boolean
}

export const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  publicKey: null,
  balance: 0,
  connect: async () => {},
  disconnect: () => {},
  solPrice: 150,
  isDevnet: true,
})

// Solana connection - using devnet
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com")

// Check if we're on devnet
const isDevnet = connection.rpcEndpoint.includes("devnet")

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [solPrice, setSolPrice] = useState(150) // Default SOL price in USD
  const { toast } = useToast()

  // Get Phantom provider
  const getProvider = (): PhantomProvider | undefined => {
    if (typeof window === "undefined") {
      return undefined
    }

    const win = window as WindowWithSolana

    // Check if Phantom is installed
    const provider = win.phantom?.solana || win.solana

    if (provider?.isPhantom) {
      return provider
    }

    // If we're in development mode, provide a mock provider for testing
    if (process.env.NODE_ENV === "development" && !provider) {
      console.warn("Phantom wallet not detected. Using mock provider for development.")

      // This is a very simple mock for development purposes
      const mockProvider: PhantomProvider = {
        isPhantom: true,
        publicKey: {
          toString: () => "MockPhantomWalletAddress123456789",
        } as unknown as PublicKey,
        connect: async () => ({
          publicKey: {
            toString: () => "MockPhantomWalletAddress123456789",
          } as unknown as PublicKey,
        }),
        disconnect: async () => {},
        on: (event: PhantomEvent, callback: (args: any) => void) => {},
      }

      return mockProvider
    }

    return undefined
  }

  // Fetch SOL price
  const fetchSolPrice = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd")
      const data = await response.json()
      if (data.solana && data.solana.usd) {
        setSolPrice(data.solana.usd)
      }
    } catch (error) {
      console.error("Error fetching SOL price:", error)
    }
  }

  // Fetch wallet balance
  const fetchBalance = async (walletAddress: string) => {
    try {
      const pubKey = new PublicKey(walletAddress)
      const balance = await connection.getBalance(pubKey)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error("Error fetching balance:", error)
      // Set a default balance for development or if there's an error
      if (process.env.NODE_ENV === "development") {
        setBalance(5.0) // Mock balance for development
      } else {
        setBalance(0)
      }
    }
  }

  // Check if wallet was previously connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const provider = getProvider()

        if (provider && provider.publicKey) {
          try {
            setConnected(true)
            const publicKeyString = provider.publicKey.toString()
            setPublicKey(publicKeyString)
            await fetchBalance(publicKeyString)
          } catch (error) {
            console.error("Error checking wallet connection:", error)
            // Don't set connected if we can't properly initialize
            setConnected(false)
            setPublicKey(null)
          }
        }
      } catch (error) {
        console.error("Error in wallet connection check:", error)
      }
    }

    checkWalletConnection()
    fetchSolPrice()

    // Set up interval to refresh SOL price every 5 minutes
    const priceInterval = setInterval(fetchSolPrice, 5 * 60 * 1000)

    return () => {
      clearInterval(priceInterval)
    }
  }, [])

  // Connect to Phantom wallet
  const connect = async () => {
    try {
      setConnecting(true)
      const provider = getProvider()

      if (!provider) {
        toast({
          title: "Phantom wallet not found",
          description: "Please install Phantom wallet to continue.",
          variant: "destructive",
        })
        window.open("https://phantom.app/", "_blank")
        return
      }

      try {
        // Connect to wallet
        const { publicKey } = await provider.connect()
        const publicKeyString = publicKey.toString()

        setConnected(true)
        setPublicKey(publicKeyString)

        // Fetch balance
        await fetchBalance(publicKeyString)

        // Set up event listeners
        provider.on("disconnect", () => {
          setConnected(false)
          setPublicKey(null)
          setBalance(0)
        })

        provider.on("accountChanged", (publicKey: PublicKey | null) => {
          if (publicKey) {
            const publicKeyString = publicKey.toString()
            setPublicKey(publicKeyString)
            fetchBalance(publicKeyString)
          } else {
            setConnected(false)
            setPublicKey(null)
            setBalance(0)
          }
        })
      } catch (error: any) {
        // Handle user rejection specifically
        if (error.message && error.message.includes("User rejected")) {
          toast({
            title: "Connection cancelled",
            description: "You cancelled the connection request.",
          })
        } else {
          console.error("Error connecting wallet:", error)
          toast({
            title: "Connection failed",
            description: "Failed to connect wallet. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      toast({
        title: "Connection error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setConnecting(false)
    }
  }

  // Disconnect from Phantom wallet
  const disconnect = async () => {
    try {
      const provider = getProvider()

      if (provider) {
        await provider.disconnect()
      }

      setConnected(false)
      setPublicKey(null)
      setBalance(0)
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
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
        solPrice,
        isDevnet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
