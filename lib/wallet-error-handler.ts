import { WalletError, WalletNotConnectedError, WalletNotReadyError } from "@solana/wallet-adapter-base"

// Define error types for better categorization
export enum WalletErrorType {
  NotInstalled = "NOT_INSTALLED",
  UserRejected = "USER_REJECTED",
  WalletLocked = "WALLET_LOCKED",
  NetworkError = "NETWORK_ERROR",
  Timeout = "TIMEOUT",
  IncompatibleVersion = "INCOMPATIBLE_VERSION",
  MultipleWallets = "MULTIPLE_WALLETS",
  PermissionDenied = "PERMISSION_DENIED",
  NotConnected = "NOT_CONNECTED",
  NotReady = "NOT_READY",
  Unknown = "UNKNOWN",
}

// Interface for structured error information
export interface WalletErrorInfo {
  type: WalletErrorType
  message: string
  suggestion: string
  originalError?: Error
}

/**
 * Parses wallet connection errors and returns structured error information
 */
export function parseWalletError(error: unknown): WalletErrorInfo {
  // Default error info
  let errorInfo: WalletErrorInfo = {
    type: WalletErrorType.Unknown,
    message: "An unknown error occurred while connecting to your wallet.",
    suggestion: "Please try again or use a different wallet.",
  }

  // Handle specific error types
  if (error instanceof WalletNotConnectedError) {
    errorInfo = {
      type: WalletErrorType.NotConnected,
      message: "Your wallet is not connected.",
      suggestion: "Please connect your wallet to continue.",
      originalError: error,
    }
  } else if (error instanceof WalletNotReadyError) {
    errorInfo = {
      type: WalletErrorType.NotReady,
      message: "Your wallet is not ready.",
      suggestion: "Please make sure your wallet is unlocked and try again.",
      originalError: error,
    }
  } else if (error instanceof WalletError) {
    // Handle general wallet errors
    errorInfo = {
      type: WalletErrorType.Unknown,
      message: error.message || "An error occurred with your wallet.",
      suggestion: "Please try again or use a different wallet.",
      originalError: error,
    }
  } else if (error instanceof Error) {
    // Parse error message for common patterns
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes("user rejected") || errorMessage.includes("cancelled")) {
      errorInfo = {
        type: WalletErrorType.UserRejected,
        message: "You declined the connection request.",
        suggestion: "Please approve the connection request in your wallet to continue.",
        originalError: error,
      }
    } else if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
      errorInfo = {
        type: WalletErrorType.Timeout,
        message: "Connection request timed out.",
        suggestion: "Please check if your wallet is responding and try again.",
        originalError: error,
      }
    } else if (errorMessage.includes("locked") || errorMessage.includes("unlock")) {
      errorInfo = {
        type: WalletErrorType.WalletLocked,
        message: "Your wallet appears to be locked.",
        suggestion: "Please unlock your wallet and try again.",
        originalError: error,
      }
    } else if (errorMessage.includes("network") || errorMessage.includes("internet")) {
      errorInfo = {
        type: WalletErrorType.NetworkError,
        message: "Network error while connecting to wallet.",
        suggestion: "Please check your internet connection and try again.",
        originalError: error,
      }
    } else if (errorMessage.includes("not installed") || errorMessage.includes("not found")) {
      errorInfo = {
        type: WalletErrorType.NotInstalled,
        message: "Wallet extension not detected.",
        suggestion: "Please install the wallet extension and refresh the page.",
        originalError: error,
      }
    } else if (errorMessage.includes("permission") || errorMessage.includes("denied")) {
      errorInfo = {
        type: WalletErrorType.PermissionDenied,
        message: "Permission to connect to wallet was denied.",
        suggestion: "Please check your wallet settings and try again.",
        originalError: error,
      }
    } else if (errorMessage.includes("version") || errorMessage.includes("incompatible")) {
      errorInfo = {
        type: WalletErrorType.IncompatibleVersion,
        message: "Incompatible wallet version.",
        suggestion: "Please update your wallet to the latest version.",
        originalError: error,
      }
    } else if (errorMessage.includes("multiple") || errorMessage.includes("conflict")) {
      errorInfo = {
        type: WalletErrorType.MultipleWallets,
        message: "Multiple wallet extensions detected.",
        suggestion: "Please disable all but one wallet extension and try again.",
        originalError: error,
      }
    } else {
      errorInfo = {
        type: WalletErrorType.Unknown,
        message: error.message,
        suggestion: "Please try again or use a different wallet.",
        originalError: error,
      }
    }
  }

  return errorInfo
}

/**
 * Gets a color class based on error type for UI styling
 */
export function getErrorColorClass(errorType: WalletErrorType): string {
  switch (errorType) {
    case WalletErrorType.UserRejected:
    case WalletErrorType.WalletLocked:
      return "text-yellow-500 bg-yellow-500/10" // Warning color
    case WalletErrorType.NotInstalled:
    case WalletErrorType.NotConnected:
    case WalletErrorType.NotReady:
      return "text-blue-500 bg-blue-500/10" // Info color
    case WalletErrorType.NetworkError:
    case WalletErrorType.Timeout:
    case WalletErrorType.IncompatibleVersion:
    case WalletErrorType.MultipleWallets:
    case WalletErrorType.PermissionDenied:
    case WalletErrorType.Unknown:
      return "text-red-500 bg-red-500/10" // Error color
    default:
      return "text-red-500 bg-red-500/10" // Default error color
  }
}

/**
 * Gets an appropriate icon name based on error type
 */
export function getErrorIconName(errorType: WalletErrorType): string {
  switch (errorType) {
    case WalletErrorType.UserRejected:
    case WalletErrorType.WalletLocked:
      return "alert-triangle" // Warning icon
    case WalletErrorType.NotInstalled:
    case WalletErrorType.NotConnected:
    case WalletErrorType.NotReady:
      return "info" // Info icon
    case WalletErrorType.NetworkError:
    case WalletErrorType.Timeout:
      return "wifi-off" // Network error icon
    case WalletErrorType.IncompatibleVersion:
      return "alert-circle" // Alert icon
    case WalletErrorType.MultipleWallets:
      return "layers" // Multiple layers icon
    case WalletErrorType.PermissionDenied:
      return "shield-off" // Permission denied icon
    case WalletErrorType.Unknown:
    default:
      return "alert-circle" // Default error icon
  }
}
