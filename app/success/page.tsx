"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [nftImage, setNftImage] = useState("/images/profile-nft.png")

  useEffect(() => {
    const image = searchParams.get("image")
    if (image) {
      setNftImage(image)
    }
  }, [searchParams])

  return (
    <main className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-white mb-4">Congratulations!</h1>
        <h2 className="text-3xl font-bold text-white mb-8">You&apos;ve minted your exclusive NFT.</h2>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 mb-8">
          <Image src={nftImage || "/placeholder.svg"} alt="Your NFT" width={400} height={400} className="rounded-2xl" />
        </div>

        <p className="text-2xl text-white mb-8">You have successfully minted your NFT.</p>

        <Link href="/referrals">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xl py-6 rounded-full">
            View My Referrals
          </Button>
        </Link>

        <p className="text-2xl text-white mt-8">Referrals Unlocked!</p>
      </div>
    </main>
  )
}
