"use client"

import { Button } from "@/components/ui/button"

export function QuestSection() {
  return (
    <div className="mt-12">
      <h2 className="text-4xl font-bold text-white mb-4">Quests</h2>
      <p className="text-white/70 mb-6">Complete quests to earn points</p>

      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6">View</Button>
    </div>
  )
}
