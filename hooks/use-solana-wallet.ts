"use client"

import { useWallet as useAdapterWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useConnection } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getSolPrice } from "@/lib/solana"

export function useSolanaWallet() {
  const {
    publicKey,
    connecting,
    connected,
    disconnect: adapterDisconnect,
    wallet,
    select,
    wallets,
    signMessage,
    signTransaction,
  } = useAdapterWallet()

  const { visible, setVisible } = useWalletModal()
  const { connection } = useConnection()
  const { toast } = useToast()

  const [balance, setBalance] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [solPrice, setSolPrice] = useState(150) // Default SOL price in USD
  const [isDevnet, setIsDevnet] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detect if we're on a mobile device
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  }, [])

  // Check if we're on devnet
  useEffect(() => {
    setIsDevnet(connection.rpcEndpoint.includes("devnet") || connection.rpcEndpoint.includes("testnet"))
  }, [connection.rpcEndpoint])

  // Fetch SOL price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const price = await getSolPrice()
        setSolPrice(price)
      } catch (error) {
        console.error("Error fetching SOL price:", error)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 5 * 60 * 1000) // Update every 5 minutes

    return () => clearInterval(interval)
  }, [])

  // Fetch wallet balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connection) {
        try {
          const balance = await connection.getBalance(publicKey)
          setBalance(balance / LAMPORTS_PER_SOL)

          // For demo purposes, set a mock USDC balance
          // In a real app, you would fetch the actual token balance
          setUsdcBalance(25.5)
        } catch (error) {
          console.error("Error fetching balance:", error)
          setBalance(0)
        }
      } else {
        setBalance(0)
        setUsdcBalance(0)
      }
    }

    if (connected && publicKey) {
      fetchBalance()

      // Set up an interval to refresh the balance
      const interval = setInterval(fetchBalance, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [publicKey, connected, connection])

  // Connect wallet function
  const connect = useCallback(() => {
    if (connecting) return

    try {
      setVisible(true)
    } catch (error) {
      console.error("Error opening wallet modal:", error)
      toast({
        title: "Connection Error",
        description: "Failed to open wallet selection. Please try again.",
        variant: "destructive",
      })
    }
  }, [connecting, setVisible, toast])

  // Disconnect wallet function
  const disconnect = useCallback(async () => {
    try {
      await adapterDisconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
      toast({
        title: "Disconnect Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }, [adapterDisconnect, toast])

  // Handle connection changes
  useEffect(() => {
    if (connected && publicKey) {
      toast({
        title: "Wallet Connected",
        description: `Connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
      })
    }
  }, [connected, publicKey, toast])

  return {
    publicKey: publicKey?.toString() || null,
    connecting,
    connected,
    connect,
    disconnect,
    balance,
    usdcBalance,
    solPrice,
    isDevnet,
    isMobile,
    wallet,
    wallets,
    select,
    signMessage,
    signTransaction,
    isWalletModalOpen: visible,
    openWalletModal: () => setVisible(true),
    closeWalletModal: () => setVisible(false),
  }
}
