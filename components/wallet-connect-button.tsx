"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2, ChevronDown, LogOut, ExternalLink, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { formatWalletAddress, formatCurrency } from "@/lib/utils"
import { WalletSelectModal } from "@/components/wallet-select-modal"

interface WalletConnectButtonProps {
  className?: string
  onSuccess?: () => void
}

export function WalletConnectButton({ className, onSuccess }: WalletConnectButtonProps) {
  const wallet = useWallet()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [publicKeyStr, setPublicKeyStr] = useState<string | null>(null)
  const [solBalance, setSolBalance] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)

  // Add this near the top of the component, after the state declarations
  useEffect(() => {
    // Check for existing connection on component mount
    const checkExistingConnection = async () => {
      // If wallet adapter indicates we're connected, ensure our local state reflects that
      if (wallet?.connected && wallet?.publicKey) {
        setIsConnected(true)
        setPublicKeyStr(wallet.publicKey)
        setSolBalance(wallet.solBalance)
        setUsdtBalance(wallet.usdtBalance)
        console.log("Existing wallet connection detected")
      }
    }

    checkExistingConnection()
  }, [])

  // Safely access wallet properties
  useEffect(() => {
    // Check if wallet is already connected when component mounts
    if (wallet) {
      setIsConnected(wallet.connected)
      setIsConnecting(wallet.connecting)
      setPublicKeyStr(wallet.publicKey)
      setSolBalance(wallet.solBalance)
      setUsdtBalance(wallet.usdtBalance)

      // Add event listener for wallet connection changes
      const checkWalletStatus = () => {
        setIsConnected(wallet.connected)
        setPublicKeyStr(wallet.publicKey)
        setSolBalance(wallet.solBalance)
        setUsdtBalance(wallet.usdtBalance)
      }

      // Check wallet status on focus to handle returning to the page
      window.addEventListener("focus", checkWalletStatus)

      return () => {
        window.removeEventListener("focus", checkWalletStatus)
      }
    }
  }, [wallet])

  const handleConnect = async () => {
    setIsConnecting(true)

    try {
      if (wallet) {
        console.log("Initiating wallet connection...")
        // This will open our custom wallet modal
        await wallet.connect()

        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (wallet) {
      try {
        console.log("Disconnecting wallet...")
        await wallet.disconnect()
      } catch (error) {
        console.error("Disconnect error:", error)
        toast({
          title: "Disconnect failed",
          description: "Failed to disconnect wallet. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // If we're connected, show the wallet info dropdown
  if (isConnected && publicKeyStr) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`bg-white text-[#001F2B] hover:bg-white/90 ${className}`}>
              {formatWalletAddress(publicKeyStr)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between">
              <span>SOL Balance:</span>
              <span className="font-medium">{formatCurrency(solBalance)} SOL</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-between">
              <span>USDT Balance:</span>
              <span className="font-medium">{formatCurrency(usdtBalance)} USDT</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => {
                if (publicKeyStr) {
                  navigator.clipboard.writeText(publicKeyStr)
                  toast({
                    title: "Address Copied",
                    description: "Wallet address copied to clipboard",
                  })
                }
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center">
              <a
                href={`https://explorer.solana.com/address/${publicKeyStr}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center text-red-500" onClick={handleDisconnect}>
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Render the wallet modal but keep it closed */}
        <WalletSelectModal
          open={wallet.isWalletModalOpen}
          onClose={() => wallet.setIsWalletModalOpen(false)}
          onSuccess={onSuccess}
        />
      </>
    )
  }

  // If we're connecting, show a loading state
  if (isConnecting) {
    return (
      <>
        <Button className={`bg-white text-[#001F2B] hover:bg-white/90 ${className}`} disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </Button>

        {/* Render the wallet modal */}
        <WalletSelectModal
          open={wallet.isWalletModalOpen}
          onClose={() => wallet.setIsWalletModalOpen(false)}
          onSuccess={onSuccess}
        />
      </>
    )
  }

  // Standard connect button
  return (
    <>
      <Button
        className={`bg-white text-[#001F2B] hover:bg-white/90 ${className}`}
        onClick={handleConnect}
        disabled={isConnecting || wallet?.connecting}
      >
        {isConnecting || wallet?.connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>

      {/* Render the wallet modal but keep it closed unless isWalletModalOpen is true */}
      <WalletSelectModal
        open={wallet.isWalletModalOpen}
        onClose={() => wallet.setIsWalletModalOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  )
}
