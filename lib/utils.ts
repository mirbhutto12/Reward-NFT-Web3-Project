import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine class names with Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get RPC URL from environment variables
export function getRpcUrl(): string {
  return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
}

// Format wallet address for display
export function formatWalletAddress(address: string | null): string {
  if (!address) return "Not connected"
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// Format currency with 2 decimal places
export function formatCurrency(amount: number): string {
  return amount.toFixed(2)
}

// Sanitize URL
export function sanitizeUrl(url: string): string {
  try {
    new URL(url)
    return url
  } catch (e) {
    console.error("Invalid URL:", url)
    return "https://api.devnet.solana.com" // Fallback to default
  }
}

// Generate referral code from wallet address
export function generateReferralCode(walletAddress: string): string {
  return walletAddress.substring(0, 8)
}

// Check if we're on a mobile device
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
