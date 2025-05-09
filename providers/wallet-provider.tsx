"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token"
import { useToast } from "@/components/ui/use-toast"
import { getRpcUrl } from "@/lib/utils"
// Add the import for our server action at the top of the file
import { getUsdtTokenAddress } from "@/lib/token-actions"

// Types
type WalletContextType = {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  solBalance: number
  usdtBalance: number
  connect: () => Promise<boolean>
  disconnect: () => Promise<void>
  checkUsdtBalance: () => Promise<boolean>
  transferUsdt: (recipientAddress: string, amount: number) => Promise<boolean>
  connectionError: string | null
  balanceVerified: boolean
  verifyingBalance: boolean
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [solBalance, setSolBalance] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [balanceVerified, setBalanceVerified] = useState(false)
  const [verifyingBalance, setVerifyingBalance] = useState(false)
  const { toast } = useToast()

  // Initialize connection
  const connection = new Connection(getRpcUrl())

  // IMPORTANT: Remove ALL references to environment variables
  // Do NOT define any token addresses here in the client component
  // We will fetch them from the server when needed

  // Check if wallet was previously connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const provider = getProvider()
        if (provider && provider.isConnected && provider.publicKey) {
          setConnected(true)
          setPublicKey(provider.publicKey.toString())
          await fetchBalances(provider.publicKey.toString())
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkWalletConnection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Get wallet provider
  const getProvider = () => {
    if (typeof window !== "undefined") {
      const provider = (window as any).solana
      if (provider?.isPhantom) {
        return provider
      }
    }
    return null
  }

  // Fetch SOL and USDT balances
  const fetchBalances = async (address: string) => {
    try {
      // Fetch SOL balance
      const pubKey = new PublicKey(address)
      const solBalanceRaw = await connection.getBalance(pubKey)
      const solBalanceFormatted = solBalanceRaw / LAMPORTS_PER_SOL
      setSolBalance(solBalanceFormatted)

      // Fetch USDT balance
      try {
        // Get the token address from the server
        const tokenAddressStr = await getUsdtTokenAddress()
        const tokenMint = new PublicKey(tokenAddressStr)

        const tokenAddress = await getAssociatedTokenAddress(tokenMint, pubKey)
        try {
          const tokenAccount = await getAccount(connection, tokenAddress)
          const usdtBalanceFormatted = Number(tokenAccount.amount) / Math.pow(10, 6) // USDT has 6 decimals
          setUsdtBalance(usdtBalanceFormatted)
        } catch (error) {
          // Token account doesn't exist yet
          console.log("Token account not found, balance is 0")
          setUsdtBalance(0)
        }
      } catch (error) {
        console.error("Error fetching USDT balance:", error)
        setUsdtBalance(0)
      }
    } catch (error) {
      console.error("Error fetching balances:", error)
      setSolBalance(0)
      setUsdtBalance(0)
    }
  }

  // Connect wallet
  const connect = async (): Promise<boolean> => {
    setConnectionError(null)
    setConnecting(true)

    try {
      const provider = getProvider()

      if (!provider) {
        toast({
          title: "Wallet not found",
          description: "Please install Phantom wallet extension",
          variant: "destructive",
        })
        setConnectionError("Phantom wallet not installed")
        setConnecting(false)
        return false
      }

      try {
        const response = await provider.connect()
        const walletPublicKey = response.publicKey.toString()

        setConnected(true)
        setPublicKey(walletPublicKey)

        // Fetch balances after connection
        await fetchBalances(walletPublicKey)

        toast({
          title: "Wallet connected",
          description: `Connected to ${walletPublicKey.slice(0, 4)}...${walletPublicKey.slice(-4)}`,
        })

        // Set up event listeners
        provider.on("disconnect", () => {
          setConnected(false)
          setPublicKey(null)
          setSolBalance(0)
          setUsdtBalance(0)
          setBalanceVerified(false)
          toast({
            title: "Wallet disconnected",
            description: "Your wallet has been disconnected",
          })
        })

        return true
      } catch (error: any) {
        console.error("Error connecting wallet:", error)

        // Handle user rejection specifically
        if (error.message && error.message.includes("User rejected")) {
          toast({
            title: "Connection cancelled",
            description: "You cancelled the connection request",
          })
          setConnectionError("User rejected connection")
        } else {
          toast({
            title: "Connection failed",
            description: "Failed to connect wallet. Please try again",
            variant: "destructive",
          })
          setConnectionError(error.message || "Unknown connection error")
        }

        return false
      }
    } catch (error: any) {
      console.error("Unexpected error:", error)
      toast({
        title: "Connection error",
        description: "An unexpected error occurred. Please try again",
        variant: "destructive",
      })
      setConnectionError(error.message || "Unexpected error")
      return false
    } finally {
      setConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = async (): Promise<void> => {
    try {
      const provider = getProvider()
      if (provider) {
        await provider.disconnect()
      }
      setConnected(false)
      setPublicKey(null)
      setSolBalance(0)
      setUsdtBalance(0)
      setBalanceVerified(false)

      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      })
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
      toast({
        title: "Disconnect failed",
        description: "Failed to disconnect wallet. Please try again",
        variant: "destructive",
      })
    }
  }

  // Check if user has minimum USDT balance
  const checkUsdtBalance = async (): Promise<boolean> => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return false
    }

    setVerifyingBalance(true)

    try {
      // Refresh balance before checking
      await fetchBalances(publicKey)

      // Check if balance meets minimum requirement (10 USDT)
      const hasMinimumBalance = usdtBalance >= 10

      setBalanceVerified(hasMinimumBalance)

      if (hasMinimumBalance) {
        toast({
          title: "Balance verified",
          description: "You have sufficient USDT balance to mint an NFT",
        })
      } else {
        toast({
          title: "Insufficient balance",
          description: `You need at least 10 USDT to mint an NFT. Current balance: ${usdtBalance.toFixed(2)} USDT`,
          variant: "destructive",
        })
      }

      return hasMinimumBalance
    } catch (error) {
      console.error("Error checking USDT balance:", error)
      toast({
        title: "Balance check failed",
        description: "Failed to verify your USDT balance. Please try again",
        variant: "destructive",
      })
      return false
    } finally {
      setVerifyingBalance(false)
    }
  }

  // Transfer USDT to company wallet
  const transferUsdt = async (recipientAddress: string, amount: number): Promise<boolean> => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return false
    }

    try {
      const provider = getProvider()
      if (!provider) {
        toast({
          title: "Wallet not found",
          description: "Please install Phantom wallet extension",
          variant: "destructive",
        })
        return false
      }

      // Get the token address from the server
      const tokenAddressStr = await getUsdtTokenAddress()

      // This is a simplified version - in a real app, you would:
      // 1. Create a transaction to transfer USDT tokens using the fetched token address
      // 2. Sign it with the user's wallet
      // 3. Send and confirm the transaction

      toast({
        title: "Transfer initiated",
        description: `Transferring ${amount} USDT to company wallet...`,
      })

      // Simulate successful transfer
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update balance after transfer
      await fetchBalances(publicKey)

      toast({
        title: "Transfer successful",
        description: `Successfully transferred ${amount} USDT to company wallet`,
      })

      return true
    } catch (error) {
      console.error("Error transferring USDT:", error)
      toast({
        title: "Transfer failed",
        description: "Failed to transfer USDT. Please try again",
        variant: "destructive",
      })
      return false
    }
  }

  const value = {
    connected,
    connecting,
    publicKey,
    solBalance,
    usdtBalance,
    connect,
    disconnect,
    checkUsdtBalance,
    transferUsdt,
    connectionError,
    balanceVerified,
    verifyingBalance,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Custom hook to use the wallet context
export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
