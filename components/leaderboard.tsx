export function Leaderboard() {
  // Mock leaderboard data
  const leaderboardData = [
    { address: "0xfd5....b3c4", points: 1840 },
    { address: "0x124...64f9", points: 1570 },
    { address: "0x54a...2b7d", points: 1320 },
    { address: "0x3b2...c9e0", points: 1140 },
    { address: "0x9f1...e3a8", points: 980 },
  ]

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
      {leaderboardData.map((entry, index) => (
        <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === 0
                  ? "bg-cyan-400"
                  : index === 1
                    ? "bg-green-400"
                    : index === 2
                      ? "bg-blue-500"
                      : index === 3
                        ? "bg-yellow-500"
                        : "bg-orange-500"
              }`}
            ></div>
            <span className="text-white">{entry.address}</span>
          </div>
          <span className="text-white font-bold">{entry.points}</span>
        </div>
      ))}
    </div>
  )
}
