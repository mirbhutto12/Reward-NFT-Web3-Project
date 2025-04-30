import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Sanitizes a URL by removing any trailing semicolons or quotes
 */
export function sanitizeUrl(url: string | undefined): string {
  if (!url) return "https://api.devnet.solana.com" // Default fallback

  // Remove trailing semicolons and quotes
  let sanitized = url.trim()

  // Remove trailing semicolons
  while (sanitized.endsWith(";")) {
    sanitized = sanitized.slice(0, -1)
  }

  // Remove surrounding quotes if present
  if (
    (sanitized.startsWith('"') && sanitized.endsWith('"')) ||
    (sanitized.startsWith("'") && sanitized.endsWith("'"))
  ) {
    sanitized = sanitized.slice(1, -1)
  }

  // Ensure URL starts with http:// or https://
  if (!sanitized.startsWith("http://") && !sanitized.startsWith("https://")) {
    sanitized = "https://" + sanitized
  }

  return sanitized
}

// Get the sanitized RPC URL
export function getRpcUrl(): string {
  const defaultUrl =
    "https://morning-indulgent-energy.solana-devnet.quiknode.pro/450ae68bfe8c733d96e2301292cc52bab5ceb2cf/"
  return sanitizeUrl(process.env.SOLANA_RPC_URL || defaultUrl)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
