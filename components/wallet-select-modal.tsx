"use client"

import { useState, useEffect } from "react"
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { WalletReadyState } from "@solana/wallet-adapter-base"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, AlertTriangle, Info, WifiOff, AlertCircle, Layers, ShieldOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isMobileDevice } from "@/lib/utils"
import { parseWalletError, WalletErrorType, getErrorColorClass, getErrorIconName } from "@/lib/wallet-error-handler"
import { useToast } from "@/components/ui/use-toast"

// WalletButton component for wallet selection
interface WalletButtonProps {
  name: string
  icon?: string
  selected: boolean
  connecting: boolean
  onClick: () => void
}

function WalletButton({ name, icon, selected, connecting, onClick }: WalletButtonProps) {
  return (
    <Button
      variant={selected ? "default" : "outline"}
      className={`w-full justify-start h-14 ${selected ? "bg-theme-teal text-theme-dark" : ""}`}
      onClick={onClick}
      disabled={connecting}
    >
      {icon && (
        <div className="mr-2 h-6 w-6 overflow-hidden rounded-full">
          <img src={icon || "/placeholder.svg"} alt={`${name} icon`} className="h-full w-full object-contain" />
        </div>
      )}
      <span>{name}</span>
      {connecting && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
    </Button>
  )
}

interface WalletSelectModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function WalletSelectModal({ open, onClose, onSuccess }: WalletSelectModalProps) {
  const { wallets, select, connecting, connected, wallet } = useSolanaWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [errorInfo, setErrorInfo] = useState<{ type: WalletErrorType; message: string; suggestion: string } | null>(
    null,
  )
  const [isMobile, setIsMobile] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const { toast } = useToast()

  // Check if we're on a mobile device
  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedWallet(null)
      setErrorInfo(null)
      setIsRetrying(false)
    }
  }, [open])

  // Close modal if connection is successful
  useEffect(() => {
    if (connected && open) {
      console.log("Wallet connected successfully, closing modal")
      onClose()
      if (onSuccess) onSuccess()
    }
  }, [connected, open, onClose, onSuccess])

  // Track wallet selection changes
  useEffect(() => {
    if (wallet && selectedWallet !== wallet.adapter.name) {
      console.log(`Wallet selected: ${wallet.adapter.name}`)
      setSelectedWallet(wallet.adapter.name)
    }
  }, [wallet, selectedWallet])

  const handleWalletSelect = async (walletName: string) => {
    try {
      console.log(`Selecting wallet: ${walletName}`)
      setSelectedWallet(walletName)
      setErrorInfo(null)
      setIsRetrying(false)

      // Find the wallet adapter
      const selectedWalletAdapter = wallets.find((w) => w.adapter.name === walletName)

      if (!selectedWalletAdapter) {
        console.error(`Wallet ${walletName} not found in available wallets`)
        setErrorInfo({
          type: WalletErrorType.NotInstalled,
          message: `Wallet ${walletName} not found`,
          suggestion: "Please install the wallet and refresh the page",
        })
        return
      }

      // Select the wallet
      console.log(`Selecting wallet adapter: ${walletName}`)
      select(walletName)

      // If on mobile and wallet is not installed, redirect to wallet website
      if (isMobile && selectedWalletAdapter.readyState !== WalletReadyState.Installed) {
        // Get deep link for the wallet
        let deepLink = ""

        if (walletName.toLowerCase() === "phantom") {
          deepLink = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`
        } else if (walletName.toLowerCase() === "solflare") {
          deepLink = `https://solflare.com/ul/v1/browse/${encodeURIComponent(window.location.href)}`
        }

        if (deepLink) {
          console.log(`Redirecting to mobile wallet: ${deepLink}`)
          // Store connection attempt in session storage
          sessionStorage.setItem("walletConnectionAttempt", "true")
          sessionStorage.setItem("walletConnectionTimestamp", Date.now().toString())
          sessionStorage.setItem("walletConnectionName", walletName)

          // Redirect to wallet app
          window.location.href = deepLink
        }
      }
    } catch (error) {
      console.error("Error selecting wallet:", error)
      const parsedError = parseWalletError(error)
      setErrorInfo(parsedError)

      // Show toast for critical errors
      if (parsedError.type === WalletErrorType.NetworkError || parsedError.type === WalletErrorType.Unknown) {
        toast({
          title: "Connection Error",
          description: parsedError.message,
          variant: "destructive",
        })
      }
    }
  }

  const handleRetry = () => {
    if (selectedWallet) {
      setIsRetrying(true)
      // Short delay before retrying to ensure UI updates
      setTimeout(() => {
        handleWalletSelect(selectedWallet)
      }, 500)
    }
  }

  // Group wallets by their ready state
  const installedWallets = wallets.filter((w) => w.readyState === WalletReadyState.Installed)
  const detectableWallets = wallets.filter((w) => w.readyState === WalletReadyState.Loadable)
  const otherWallets = wallets.filter(
    (w) => w.readyState !== WalletReadyState.Installed && w.readyState !== WalletReadyState.Loadable,
  )

  // Get error icon component based on error type
  const getErrorIcon = (errorType: WalletErrorType) => {
    const iconName = getErrorIconName(errorType)
    switch (iconName) {
      case "alert-triangle":
        return <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      case "info":
        return <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      case "wifi-off":
        return <WifiOff className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      case "layers":
        return <Layers className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      case "shield-off":
        return <ShieldOff className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      case "alert-circle":
      default:
        return <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Select a wallet to connect to this app. Make sure you have the wallet installed.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={isMobile ? "mobile" : "desktop"} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>

          <TabsContent value="desktop" className="mt-4 space-y-4">
            {installedWallets.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Installed Wallets</h3>
                <div className="grid gap-2">
                  {installedWallets.map((walletAdapter) => (
                    <WalletButton
                      key={walletAdapter.adapter.name}
                      name={walletAdapter.adapter.name}
                      icon={walletAdapter.adapter.icon}
                      selected={selectedWallet === walletAdapter.adapter.name}
                      connecting={connecting && selectedWallet === walletAdapter.adapter.name}
                      onClick={() => handleWalletSelect(walletAdapter.adapter.name)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {detectableWallets.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Available Wallets</h3>
                <div className="grid gap-2">
                  {detectableWallets.map((walletAdapter) => (
                    <WalletButton
                      key={walletAdapter.adapter.name}
                      name={walletAdapter.adapter.name}
                      icon={walletAdapter.adapter.icon}
                      selected={selectedWallet === walletAdapter.adapter.name}
                      connecting={connecting && selectedWallet === walletAdapter.adapter.name}
                      onClick={() => handleWalletSelect(walletAdapter.adapter.name)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {otherWallets.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Other Wallets</h3>
                <div className="grid gap-2">
                  {otherWallets.map((walletAdapter) => (
                    <WalletButton
                      key={walletAdapter.adapter.name}
                      name={walletAdapter.adapter.name}
                      icon={walletAdapter.adapter.icon}
                      selected={selectedWallet === walletAdapter.adapter.name}
                      connecting={connecting && selectedWallet === walletAdapter.adapter.name}
                      onClick={() => handleWalletSelect(walletAdapter.adapter.name)}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {errorInfo && (
              <div className={`p-3 rounded-md flex items-start ${getErrorColorClass(errorInfo.type)}`}>
                {getErrorIcon(errorInfo.type)}
                <div className="flex-1">
                  <p className="font-medium text-sm">{errorInfo.message}</p>
                  <p className="text-sm opacity-80">{errorInfo.suggestion}</p>
                  {(errorInfo.type === WalletErrorType.UserRejected ||
                    errorInfo.type === WalletErrorType.WalletLocked ||
                    errorInfo.type === WalletErrorType.Timeout) && (
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleRetry} disabled={isRetrying}>
                      {isRetrying ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Retrying...
                        </>
                      ) : (
                        "Try Again"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {wallets.length === 0 && (
              <div className="bg-yellow-500/10 text-yellow-500 p-3 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">No wallets detected</p>
                  <p className="text-sm opacity-80">Please install a Solana wallet extension</p>
                </div>
              </div>
            )}

            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Don't have a wallet?{" "}
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-teal hover:underline inline-flex items-center"
                >
                  Install Phantom <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Mobile Wallets</h3>
              <div className="grid gap-2">
                <WalletButton
                  name="Phantom"
                  icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiB2aWV3Qm94PSIwIDAgMTA4IDEwOCIgZmlsbD0ibm9uZSI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9IiNBQjlGRjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni41MjY3IDY5LjkyMjlDNDIuMDExOSA2OS45MjI5IDM4LjM0OTYgNjYuMjYwNiAzOC4zNDk2IDYxLjc0NThDMzguMzQ5NiA1Ny4yMzExIDQyLjAxMTkgNTMuNTY4NyA0Ni41MjY3IDUzLjU2ODdDNTEuMDQxNCA1My41Njg3IDU0LjcwMzggNTcuMjMxMSA1NC43MDM4IDYxLjc0NThDNTQuNzAzOCA2Ni4yNjA2IDUxLjA0MTQgNjkuOTIyOSA0Ni41MjY3IDY5LjkyMjlaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTY5LjY5NzMgMzguMDc3MUg0NS41MjM0QzQxLjAwODcgMzguMDc3MSAzNy4zNDYzIDQxLjczOTQgMzcuMzQ2MyA0Ni4yNTQyVjUyLjU2NTRDMzcuMzQ2MyA1NC4wNTkgMzguNTU2IDU1LjI2ODcgNDAuMDQ5NiA1NS4yNjg3QzQxLjU0MzIgNTUuMjY4NyA0Mi43NTI5IDU0LjA1OSA0Mi43NTI5IDUyLjU2NTRWNDYuMjU0MkM0Mi43NTI5IDQ0Ljc2MDYgNDQuMDI5OCA0My40ODM3IDQ1LjUyMzQgNDMuNDgzN0g2OS42OTczQzcxLjE5MDkgNDMuNDgzNyA3Mi40Njc4IDQ0Ljc2MDYgNzIuNDY3OCA0Ni4yNTQyVjcxLjQzMTRDNzIuNDY3OCA3Mi45MjUgNzEuMTkwOSA3NC4yMDE5IDY5LjY5NzMgNzQuMjAxOUg0NS41MjM0QzQ0LjAyOTggNzQuMjAxOSA0Mi43NTI5IDcyLjkyNSA0Mi43NTI5IDcxLjQzMTRWNjUuMTIwMkM0Mi43NTI5IDYzLjYyNjYgNDEuNTQzMiA2Mi40MTY5IDQwLjA0OTYgNjIuNDE2OUMzOC41NTYgNjIuNDE2OSAzNy4zNDYzIDYzLjYyNjYgMzcuMzQ2MyA2NS4xMjAyVjcxLjQzMTRDMzcuMzQ2MyA3NS45NDYxIDQxLjAwODcgNzkuNjA4NSA0NS41MjM0IDc5LjYwODVINjkuNjk3M0M3NC4yMTIgNzkuNjA4NSA3Ny44NzQ0IDc1Ljk0NjEgNzcuODc0NCA3MS40MzE0VjQ2LjI1NDJDNzcuODc0NCA0MS43Mzk0IDc0LjIxMiAzOC4wNzcxIDY5LjY5NzMgMzguMDc3MVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="
                  selected={selectedWallet === "Phantom"}
                  connecting={connecting && selectedWallet === "Phantom"}
                  onClick={() => handleWalletSelect("Phantom")}
                />
                <WalletButton
                  name="Solflare"
                  icon="data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgNTAgNTAiIHdpZHRoPSI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmMxMGIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYjNmMmUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI2LjQ3ODM1IiB4Mj0iMzQuOTEwNyIgeGxpbms6aHJlZj0iI2EiIHkxPSI3LzkyIiB5Mj0iMzMuNjU5MyIvPjxyYWRpYWxHcmFkaWVudCBpZD0iYyIgY3g9IjAiIGN5PSIwIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDQuOTkyMTg4MzIgMTIuMDYzODc5NjMgLTEyLjE4MTEzNjU1IDUuMDQwNzEwNzQgMjIuNTIwMiAyMC42MTgzKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHI9IjEiIHhsaW5rOmhyZWY9IiNhIi8+PHBhdGggZD0ibTI1LjE3MDggNDcuOTEwNGMuNTI1IDAgLjk1MDcuNDIxLjk1MDcuOTQwM3MtLjQyNTcuOTQwMi0uOTUwNy45NDAyLS45NTA3LS40MjEtLjk1MDctLjk0MDIuNDI1Ny0uOTQwMy45NTA3LS45NDAzeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im04Ljk2Mzg2IDIzLjU1MDZjLS4wMDYyMy0uMTU5NC0uMDI0OTYtLjMxODctLjAyNDk2LS40NzgxIDAtNi43NzM5IDUuNDc5OTQtMTIuMjcwMiAxMi4yMzE5LTEyLjI3MDIgNi43NTIgMCAxMi4yMzE5IDUuNDk2MyAxMi4yMzE5IDEyLjI3MDIgMCAuMTU5NC0uMDE4Ny4zMTg3LS4wMjQ5LjQ3ODF6IiBmaWxsPSJ1cmwoI2IpIi8+PHBhdGggZD0ibTI0Ljk5NTkgMzMuMDkzOWM1LjA5NTEgMCA5LjIyNTYtNC4xNDU5IDkuMjI1Ni05LjI2MDggMC01LjExNDg2LTQuMTMwNS05LjI2MDctOS4yMjU2LTkuMjYwN3MtOS4yMjU2IDQuMTQ1ODQtOS4yMjU2IDkuMjYwNyA0LjEzMDUgOS4yNjA4IDkuMjI1NiA5LjI2MDh6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTI1LjE3MDggNDcuOTEwNGMuNTI1IDAgLjk1MDcuNDIxLjk1MDcuOTQwM3MtLjQyNTcuOTQwMi0uOTUwNy45NDAyLS45NTA3LS40MjEtLjk1MDctLjk0MDIuNDI1Ny0uOTQwMy45NTA3LS45NDAzeiIgZmlsbD0iI2Zm"
                  selected={selectedWallet === "Solflare"}
                  connecting={connecting && selectedWallet === "Solflare"}
                  onClick={() => handleWalletSelect("Solflare")}
                />
              </div>
            </div>

            {errorInfo && (
              <div className={`p-3 rounded-md flex items-start ${getErrorColorClass(errorInfo.type)}`}>
                {getErrorIcon(errorInfo.type)}
                <div className="flex-1">
                  <p className="font-medium text-sm">{errorInfo.message}</p>
                  <p className="text-sm opacity-80">{errorInfo.suggestion}</p>
                  {(errorInfo.type === WalletErrorType.UserRejected ||
                    errorInfo.type === WalletErrorType.WalletLocked ||
                    errorInfo.type === WalletErrorType.Timeout) && (
                    <Button variant="outline" size="sm" className="mt-2" onClick={handleRetry} disabled={isRetrying}>
                      {isRetrying ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Retrying...
                        </>
                      ) : (
                        "Try Again"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Don't have a wallet?{" "}
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-theme-teal hover:underline inline-flex items-center"
                >
                  Install Phantom <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
