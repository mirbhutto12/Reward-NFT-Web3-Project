/**
 * Utility functions for wallet connections
 */

// Check if the current device is mobile
export function isMobileDevice(): boolean {
  return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// Get the deep link for a specific wallet
export function getWalletDeepLink(walletName: string, returnUrl?: string): string {
  const url = returnUrl || window.location.href

  switch (walletName.toLowerCase()) {
    case "phantom":
      return `https://phantom.app/ul/browse/${encodeURIComponent(url)}`
    case "solflare":
      return `https://solflare.com/ul/v1/browse/${encodeURIComponent(url)}`
    default:
      return `https://phantom.app/ul/browse/${encodeURIComponent(url)}`
  }
}

// Get a list of supported wallets
export function getSupportedWallets() {
  return [
    {
      name: "Phantom",
      icon: "phantom",
      mobile: true,
      desktop: true,
    },
    {
      name: "Solflare",
      icon: "solflare",
      mobile: true,
      desktop: true,
    },
  ]
}

// Check if a specific wallet is installed
export function isWalletInstalled(walletName: string): boolean {
  if (typeof window === "undefined") return false

  const win = window as any

  switch (walletName.toLowerCase()) {
    case "phantom":
      return !!win.phantom?.solana || !!win.solana?.isPhantom
    case "solflare":
      return !!win.solflare
    default:
      return false
  }
}

// Handle mobile wallet connection
export async function handleMobileWalletConnection(walletName: string): Promise<boolean> {
  if (!isMobileDevice()) return false

  const deepLink = getWalletDeepLink(walletName)

  // Store information in sessionStorage to detect return from wallet
  sessionStorage.setItem("walletConnectionAttempt", "true")
  sessionStorage.setItem("walletConnectionTimestamp", Date.now().toString())

  // Redirect to wallet app
  window.location.href = deepLink

  return true
}

// Check if we're returning from a wallet connection attempt
export function isReturningFromWallet(): boolean {
  if (typeof window === "undefined") return false

  const connectionAttempt = sessionStorage.getItem("walletConnectionAttempt")
  const timestamp = sessionStorage.getItem("walletConnectionTimestamp")

  if (connectionAttempt === "true" && timestamp) {
    const elapsed = Date.now() - Number.parseInt(timestamp)
    // If it's been less than 5 minutes since the connection attempt
    if (elapsed < 5 * 60 * 1000) {
      // Clear the connection attempt flag
      sessionStorage.removeItem("walletConnectionAttempt")
      return true
    }
    // Clear stale connection attempts
    sessionStorage.removeItem("walletConnectionAttempt")
    sessionStorage.removeItem("walletConnectionTimestamp")
  }

  return false
}
