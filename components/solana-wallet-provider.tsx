"use client"

import { type FC, type ReactNode, useMemo, useEffect } from "react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import { getRpcUrl } from "@/lib/utils"

// Import the wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css"

interface SolanaWalletProviderProps {
  children: ReactNode
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ children }) => {
  // Get the RPC URL from environment variables or use a default
  const rpcUrl = getRpcUrl()

  // Determine if we're on devnet or mainnet
  const network =
    rpcUrl.includes("devnet") || rpcUrl.includes("testnet") ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => rpcUrl, [rpcUrl])

  // Initialize wallet adapters
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })], [network])

  // Log connection details for debugging
  useEffect(() => {
    console.log("SolanaWalletProvider initialized with:", {
      network,
      endpoint,
      walletCount: wallets.length,
    })
  }, [network, endpoint, wallets])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
