"use client"

import Image from "next/image"
import Link from "next/link"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useWallet } from "@/hooks/use-wallet"
import { ArrowRight, Check } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home() {
  // Add error handling for wallet
  const [walletReady, setWalletReady] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const wallet = useWallet()

  // Safely access wallet properties
  useEffect(() => {
    // Check if wallet is ready
    setWalletReady(true)

    // Update connection status when it changes
    if (wallet) {
      setIsConnected(wallet.connected)
    }
  }, [wallet, wallet?.connected])

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative w-8 h-8 mr-2">
            <Image src="/images/logo.jpeg" alt="Reward NFT Logo" width={32} height={32} className="object-contain" />
          </div>
          <span className="text-white font-bold">Reward NFT</span>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-white/80">
            Mint
          </Link>
          <Link href="/referrals" className="text-white hover:text-white/80">
            Referrals
          </Link>
          <Link href="/quests" className="text-white hover:text-white/80">
            Quests
          </Link>
          <Link href="/leaderboard" className="text-white hover:text-white/80">
            Leaderboard
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected && (
            <Link href="/profile">
              <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md hover:bg-white/30 transition-colors">
                My Profile
              </button>
            </Link>
          )}
          <WalletConnectButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Mint, Refer,
            <br />
            <span className="text-white">Earn Rewards</span>
          </h1>
          <p className="text-white/90 mb-8 text-lg">
            Mint your exclusive identity NFT, refer friends, complete quests, and earn real USDC rewards on the Solana
            blockchain.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/mint">
              <button className="bg-white text-[#001F2B] px-6 py-3 rounded-md font-medium flex items-center hover:bg-white/90 transition-colors">
                Mint Now <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
            <Link href="/about">
              <button className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-8">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-white text-sm">Solana-based</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-white text-sm">Earn USDC</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-white text-sm">Low Fees</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
            <div className="relative w-64 h-64">
              <Image src="/images/nft-character.png" alt="Exclusive NFT Character" fill className="object-contain" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center mt-4">
              <p className="text-white font-medium">Exclusive Identity NFT</p>
              <p className="text-white/80 text-sm">Mint Price: 10 USDC</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-white/90 mb-12 max-w-2xl mx-auto">
            A simple three-step process to start earning rewards on our platform
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Mint Your NFT</h3>
              <p className="text-white/90 mb-4">
                Connect your Solana wallet and mint your exclusive identity NFT for 10 USDC. Each wallet can mint only
                one NFT.
              </p>
              <Link href="/mint">
                <button className="text-white flex items-center text-sm hover:underline">
                  Mint Now <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Refer Friends</h3>
              <p className="text-white/90 mb-4">
                Share your unique referral link with friends. Earn 4 USDC for each friend who mints an NFT using your
                link.
              </p>
              <Link href="/referrals">
                <button className="text-white flex items-center text-sm hover:underline">
                  View Referrals <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M8.5 9.5 6 4l6 1 6-1-2.5 5.5" />
                  <path d="m8.5 14.5-2.5 5.5 6-1 6 1-2.5-5.5" />
                  <path d="M8.5 9.5 6 4l6 1 6-1-2.5 5.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Complete Quests</h3>
              <p className="text-white/90 mb-4">
                Participate in various quests to earn additional USDC rewards and climb the leaderboard rankings.
              </p>
              <Link href="/quests">
                <button className="text-white flex items-center text-sm hover:underline">
                  View Quests <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Platform Features</h2>
          <p className="text-white/90 mb-12 max-w-2xl mx-auto">Explore the key features of the Reward NFT platform</p>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
              NFT Minting
            </button>
            <button className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
              Referral System
            </button>
            <button className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
              Quests
            </button>
            <button className="bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
              Rewards
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h3 className="text-3xl font-bold text-white mb-6">Exclusive Identity NFT</h3>
              <p className="text-white/90 mb-6">
                Mint your unique identity NFT on the Solana blockchain. Each wallet can only mint one NFT, making it a
                truly exclusive item in your collection.
              </p>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white">Powered by Solana for low gas fees</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white">Mint price: 10 USDC per NFT</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white">Limited to one NFT per wallet</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white">Unlocks access to the referral system</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white">Exclusive identity representation</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5" />
                  <span className="text-white">Future utility and benefits</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link href="/mint">
                  <button className="bg-white text-[#001F2B] px-6 py-3 rounded-md font-medium hover:bg-white/90 transition-colors">
                    Mint Your NFT
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <Image src="/images/gift-box.png" alt="Mystery NFT Box" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Earning?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Mint your exclusive NFT today, refer friends, complete quests, and start earning real USDC rewards on the
            Solana blockchain.
          </p>
          <Link href="/mint">
            <button className="bg-white text-[#001F2B] px-8 py-3 rounded-md font-medium hover:bg-white/90 transition-colors">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-white hover:text-white/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" className="text-white hover:text-white/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="text-white hover:text-white/80">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
          <div className="text-center text-white/80 text-sm">
            <p>
              © 2023 Reward NFT. All rights reserved. |{" "}
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-white">
                Contact Us
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
