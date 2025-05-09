"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/providers/wallet-provider"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

interface BalanceVerifierProps {
  onSuccess?: () => void
  className?: string
}

export function BalanceVerifier({ onSuccess, className }: BalanceVerifierProps) {
  const { connected, usdtBalance, checkUsdtBalance, balanceVerified, verifyingBalance } = useWallet()
  const [verificationAttempted, setVerificationAttempted] = useState(false)

  const handleVerifyBalance = async () => {
    setVerificationAttempted(true)
    const success = await checkUsdtBalance()

    if (success && onSuccess) {
      onSuccess()
    }
  }

  if (!connected) {
    return (
      <div className={`p-4 bg-yellow-500/10 rounded-lg ${className}`}>
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className="text-yellow-500">Please connect your wallet first</p>
        </div>
      </div>
    )
  }

  if (balanceVerified) {
    return (
      <div className={`p-4 bg-green-500/10 rounded-lg ${className}`}>
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-green-500">Balance verified! You have sufficient USDT to mint an NFT.</p>
        </div>
        <p className="mt-2 text-sm">Current balance: {formatCurrency(usdtBalance)} USDT</p>
      </div>
    )
  }

  return (
    <div className={`p-4 bg-white/10 rounded-lg ${className}`}>
      <h3 className="text-lg font-medium mb-2">Verify USDT Balance</h3>
      <p className="text-sm mb-4">
        You need at least 10 USDT to mint an NFT. Current balance: {formatCurrency(usdtBalance)} USDT
      </p>

      {verifyingBalance && (
        <div className="mb-4">
          <p className="text-sm mb-2">Verifying balance...</p>
          <Progress value={66} className="h-2" />
        </div>
      )}

      {verificationAttempted && !balanceVerified && !verifyingBalance && (
        <div className="mb-4 p-3 bg-red-500/10 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-500">Insufficient balance. You need at least 10 USDT.</p>
          </div>
        </div>
      )}

      <Button onClick={handleVerifyBalance} disabled={verifyingBalance} className="w-full">
        {verifyingBalance ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Balance"
        )}
      </Button>
    </div>
  )
}
