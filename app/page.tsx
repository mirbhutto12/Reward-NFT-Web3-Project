import { MintSection } from "@/components/mint-section"
import { NavBar } from "@/components/nav-bar"
import { FaqSection } from "@/components/faq-section"
import { SocialLinks } from "@/components/social-links"
import { getCurrentSlot } from "@/lib/actions"

export default async function Home() {
  const slot = await getCurrentSlot()

  return (
    <main className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 pb-8">
        <NavBar />
        <MintSection />
        <FaqSection />
        <SocialLinks />
        <div className="p-4">
          <h1>🔗 Current Solana Slot</h1>
          <p>Slot: {slot}</p>
        </div>
        <footer className="text-center text-white mt-8">
          <p>Powered by Reward NFT</p>
        </footer>
      </div>
    </main>
  )
}
