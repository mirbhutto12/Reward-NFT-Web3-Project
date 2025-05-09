"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  return (
    <div className="max-w-3xl mx-auto mt-12">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-white/20">
          <AccordionTrigger className="text-white text-xl font-medium py-4">What is Reward NFT?</AccordionTrigger>
          <AccordionContent className="text-white/80 bg-white/5 p-4 rounded-lg">
            Reward NFT is a platform that allows users to mint exclusive NFTs, earn points through referrals, and
            complete quests to unlock rewards.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-white/20">
          <AccordionTrigger className="text-white text-xl font-medium py-4">What is an NFT?</AccordionTrigger>
          <AccordionContent className="text-white/80 bg-white/5 p-4 rounded-lg">
            NFT stands for Non-Fungible Token. It's a digital asset that represents ownership of a unique item or piece
            of content on the blockchain, making digital items scarce, provably unique, and tradable.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border-white/20">
          <AccordionTrigger className="text-white text-xl font-medium py-4">How do I earn rewards?</AccordionTrigger>
          <AccordionContent className="text-white/80 bg-white/5 p-4 rounded-lg">
            You can earn rewards by minting NFTs, referring friends to the platform, and completing various quests. Each
            successful referral earns you 2 USDT, and completing quests earns you points that can be exchanged for
            rewards.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
