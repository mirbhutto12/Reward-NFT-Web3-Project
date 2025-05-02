"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QrCode } from "lucide-react"
import { useSolanaWallet } from "@/hooks/use-solana-wallet"

export function WalletQrConnect() {
  const { connected, isMobile } = useSolanaWallet()
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  // Don't show QR code option on mobile devices
  if (isMobile || connected) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full ml-2">
          <QrCode className="h-5 w-5" />
          <span className="sr-only">Connect with QR Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect with QR Code</DialogTitle>
          <DialogDescription>Scan this QR code with your mobile wallet app to connect.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-4">
          {qrCodeUrl ? (
            <div className="bg-white p-4 rounded-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`}
                alt="Wallet connection QR code"
                width={200}
                height={200}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-sm text-muted-foreground mb-4">Loading QR code...</p>
              <Button
                onClick={() => {
                  setQrCodeUrl(window.location.href)
                }}
              >
                Generate QR Code
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-4">
            Open your wallet app, scan this QR code, and approve the connection request.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
