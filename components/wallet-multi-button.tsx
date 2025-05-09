"use client"

import dynamic from "next/dynamic"

// Dynamically import the WalletMultiButton to avoid SSR issues
export const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
)
