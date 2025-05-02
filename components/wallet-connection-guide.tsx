"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSolanaWallet } from "@/hooks/use-solana-wallet"
import { HelpCircle, ExternalLink } from "lucide-react"

export function WalletConnectionGuide() {
  const { isMobile } = useSolanaWallet()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Wallet Connection Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Wallet Connection Guide</DialogTitle>
          <DialogDescription>Learn how to connect your Solana wallet to our app.</DialogDescription>
        </DialogHeader>

        {isMobile ? (
          <div className="space-y-4">
            <h3 className="font-medium">Connecting on Mobile</h3>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Step 1: Install a Wallet</h4>
              <p className="text-sm text-muted-foreground">
                First, make sure you have a Solana wallet app installed on your device.
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-[#4e44ce] text-white px-2 py-1 rounded-md"
                >
                  Phantom <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://solflare.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-[#fc812b] text-white px-2 py-1 rounded-md"
                >
                  Solflare <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Step 2: Connect Your Wallet</h4>
              <p className="text-sm text-muted-foreground">
                Tap the "Connect Wallet" button and select your wallet from the list.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Step 3: Approve the Connection</h4>
              <p className="text-sm text-muted-foreground">
                Your wallet app will open. Approve the connection request in your wallet app.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Step 4: Return to the App</h4>
              <p className="text-sm text-muted-foreground">
                After approving, you'll be redirected back to our app automatically.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Troubleshooting</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Make sure you have the latest version of your wallet app</li>
                <li>If you're not redirected back, manually return to this app</li>
                <li>Try closing all browser tabs and starting again</li>
                <li>Ensure you're using a supported browser (Chrome, Safari, Firefox)</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-medium">Connecting on Desktop</h3>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Step 1: Install a Wallet Extension</h4>
              <p className="text-sm text-muted-foreground">
                First, make sure you have a Solana wallet extension installed in your browser.
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-[#4e44ce] text-white px-2 py-1 rounded-md"
                >
                  Phantom <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://solflare.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-[#fc812b] text-white px-2 py-1 rounded-md"
                >
                  Solflare <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Step 2: Connect Your Wallet</h4>
              <p className="text-sm text-muted-foreground">
                Click the "Connect Wallet" button and select your wallet from the list.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Step 3: Approve the Connection</h4>
              <p className="text-sm text-muted-foreground">
                A popup from your wallet extension will appear. Approve the connection request.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
