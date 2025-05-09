"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, ExternalLink } from 'lucide-react'
import { useWallet } from "@/hooks/use-wallet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function WalletConnectionGuide() {
  const { isMobile } = useWallet()

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
          <DialogTitle>Phantom Wallet Connection Guide</DialogTitle>
          <DialogDescription>Learn how to connect your Phantom wallet to our app.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={isMobile ? "mobile" : "desktop"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
          </TabsList>

          <TabsContent value="mobile" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="font-medium">Step 1: Install Phantom Wallet</h3>
              <p className="text-sm text-muted-foreground">First, install the Phantom wallet app on your device:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-[#4e44ce] text-white px-2 py-1 rounded-md"
                >
                  Phantom <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Step 2: Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Tap "Connect Wallet" and select Phantom from the list.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Step 3: Approve Connection</h3>
              <p className="text-sm text-muted-foreground">
                The Phantom app will open. Approve the connection request.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Step 4: Return to App</h3>
              <p className="text-sm text-muted-foreground">After approving, you'll be redirected back to our app.</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Troubleshooting</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Make sure you have the latest Phantom app version</li>
                <li>If not redirected back, manually return to this app</li>
                <li>Try closing all browser tabs and starting again</li>
                <li>Ensure you're using a supported browser</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="desktop" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="font-medium">Step 1: Install Phantom Extension</h3>
              <p className="text-sm text-muted-foreground">First, install the Phantom wallet extension in your browser:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs bg-[#4e44ce] text-white px-2 py-1 rounded-md"
                >
                  Phantom <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Step 2: Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Click "Connect Wallet" and select Phantom from the list.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Step 3: Approve Connection</h3>
              <p className="text-sm text-muted-foreground">
                A popup from the Phantom extension will appear. Approve the connection request.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Troubleshooting</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Make sure the Phantom extension is installed correctly</li>
                <li>Check if your wallet is unlocked</li>
                <li>Try refreshing the page</li>
                <li>Disable other wallet extensions that might conflict</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
