"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWallet } from "@/hooks/use-wallet"

interface WalletOption {
  name: string
  icon: string
  deepLink: string
}

export function WalletSelector({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { connect } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const walletOptions: WalletOption[] = [
    {
      name: "Phantom",
      icon: "phantom",
      deepLink: `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`,
    },
    {
      name: "Solflare",
      icon: "solflare",
      deepLink: `https://solflare.com/ul/v1/browse/${encodeURIComponent(window.location.href)}`,
    },
  ]

  const handleWalletSelect = (wallet: WalletOption) => {
    setSelectedWallet(wallet.name)

    // Open the wallet app via deep link
    window.location.href = wallet.deepLink

    // Close the dialog
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="flex items-center justify-start gap-2 h-12"
              onClick={() => handleWalletSelect(wallet)}
            >
              <span>{wallet.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
