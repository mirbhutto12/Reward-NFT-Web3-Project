"use client"

// Utility functions for wallet connection

// Check if we're in a browser environment
export const isBrowser = typeof window !== "undefined"

// Check if we're on a mobile device
export const isMobileDevice = () => {
  if (!isBrowser) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Utility functions for wallet connection
 */

// Check if a wallet is installed
export function isWalletInstalled(walletName: string): boolean {
  if (typeof window === "undefined") return false

  // Check for Phantom
  if (walletName.toLowerCase() === "phantom") {
    return !!(window as any).solana?.isPhantom
  }

  // Check for Solflare
  if (walletName.toLowerCase() === "solflare") {
    return !!(window as any).solflare?.isSolflare
  }

  // Add more wallet checks as needed
  return false
}

// Get wallet connection status from local storage
export function getStoredWalletConnectionStatus(): boolean {
  try {
    return localStorage.getItem("walletConnected") === "true"
  } catch (e) {
    console.error("Failed to get stored wallet connection status:", e)
    return false
  }
}

// Store wallet connection status in localStorage
export function storeWalletConnectionStatus(connected: boolean): void {
  try {
    localStorage.setItem("walletConnected", connected ? "true" : "false")
  } catch (e) {
    console.error("Failed to store wallet connection status:", e)
  }
}

// Store last connected wallet name
export function storeLastConnectedWallet(walletName: string): void {
  try {
    localStorage.setItem("lastConnectedWallet", walletName)
  } catch (e) {
    console.error("Failed to store last connected wallet:", e)
  }
}

// Get last connected wallet name
export function getLastConnectedWallet(): string | null {
  try {
    return localStorage.getItem("lastConnectedWallet")
  } catch (e) {
    console.error("Failed to get last connected wallet:", e)
    return null
  }
}

// Clear last connected wallet
export function clearLastConnectedWallet(): void {
  try {
    localStorage.removeItem("lastConnectedWallet")
    localStorage.removeItem("walletConnected")
  } catch (e) {
    console.error("Failed to clear last connected wallet:", e)
  }
}

// Get deep link for wallet (generic approach)
export const getWalletDeepLink = (walletName = "phantom"): string => {
  const url = window.location.href

  switch (walletName.toLowerCase()) {
    case "phantom":
      return `https://phantom.app/ul/browse/${encodeURIComponent(url)}`
    case "solflare":
      return `https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}`
    case "backpack":
      return `https://backpack.app/browse/${encodeURIComponent(url)}`
    case "slope":
      return `https://slope.finance/app/browse/${encodeURIComponent(url)}`
    default:
      return `https://phantom.app/ul/browse/${encodeURIComponent(url)}`
  }
}

// Get a list of installed wallets
export const getInstalledWallets = (): string[] => {
  if (!isBrowser) return []

  const installed: string[] = []
  const win = window as any

  if (win.phantom?.solana) {
    installed.push("phantom")
  }
  if (win.solflare) {
    installed.push("solflare")
  }
  if (win.backpack) {
    installed.push("backpack")
  }
  if (win.slope) {
    installed.push("slope")
  }
  if (win.sollet) {
    installed.push("sollet")
  }
  if (win.solongWallet) {
    installed.push("solong")
  }
  if (win.mathwallet) {
    installed.push("mathwallet")
  }

  return installed
}

// Debug wallet state
export function debugWalletState(): void {
  if (typeof window === "undefined") return

  console.log("Wallet Debug Info:")
  console.log("- Phantom installed:", !!(window as any).solana?.isPhantom)
  console.log("- Solflare installed:", !!(window as any).solflare?.isSolflare)

  // Log any other relevant wallet info
  if ((window as any).solana) {
    console.log("- Phantom connected:", !!(window as any).solana?.isConnected)
  }

  if ((window as any).solflare) {
    console.log("- Solflare connected:", !!(window as any).solflare?.isConnected)
  }
}
