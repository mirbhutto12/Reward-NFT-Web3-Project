import { Connection } from "@solana/web3.js"
import { getRpcUrl } from "./utils"

type RpcEndpoint = {
  url: string
  name: string
  priority: number
  status: "available" | "unavailable" | "unknown"
  latency: number | null
}

class RpcManager {
  private endpoints: RpcEndpoint[]
  private currentEndpointIndex: number
  private checkInterval: NodeJS.Timeout | null = null

  constructor(endpoints: { url: string; name: string; priority: number }[]) {
    this.endpoints = endpoints.map((endpoint) => ({
      ...endpoint,
      status: "unknown",
      latency: null,
    }))

    // Sort by priority (lower number = higher priority)
    this.endpoints.sort((a, b) => a.priority - b.priority)

    this.currentEndpointIndex = 0
  }

  // Get the current best RPC endpoint
  public getCurrentEndpoint(): string {
    return this.endpoints[this.currentEndpointIndex].url
  }

  // Get all endpoints with their status
  public getAllEndpoints(): RpcEndpoint[] {
    return [...this.endpoints]
  }

  // Start monitoring RPC endpoints
  public startMonitoring(checkIntervalMs = 60000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }

    // Check immediately
    this.checkAllEndpoints()

    // Then set up interval
    this.checkInterval = setInterval(() => {
      this.checkAllEndpoints()
    }, checkIntervalMs)
  }

  // Stop monitoring
  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  // Check all endpoints and update their status
  private async checkAllEndpoints(): Promise<void> {
    const results = await Promise.all(
      this.endpoints.map(async (endpoint) => {
        const result = await this.checkEndpoint(endpoint.url)
        return {
          ...endpoint,
          status: result.success ? "available" : "unavailable",
          latency: result.latency,
        }
      }),
    )

    this.endpoints = results

    // Find the best available endpoint (lowest priority number that is available)
    const bestAvailableIndex = this.endpoints.findIndex((e) => e.status === "available")

    if (bestAvailableIndex !== -1) {
      this.currentEndpointIndex = bestAvailableIndex
    }
  }

  // Check a single endpoint
  private async checkEndpoint(url: string): Promise<{ success: boolean; latency: number | null }> {
    const startTime = performance.now()

    try {
      const connection = new Connection(url)
      await connection.getVersion()

      const endTime = performance.now()
      return { success: true, latency: Math.round(endTime - startTime) }
    } catch (error) {
      return { success: false, latency: null }
    }
  }
}

// Create singleton instance with default endpoints
const rpcEndpoints = [
  {
    url: getRpcUrl(),
    name: "QuickNode (Primary)",
    priority: 1,
  },
  {
    url: "https://api.devnet.solana.com",
    name: "Solana Devnet (Backup)",
    priority: 2,
  },
  {
    url: "https://devnet.helius.xyz/v0",
    name: "Helius Devnet (Backup)",
    priority: 3,
  },
]

export const rpcManager = new RpcManager(rpcEndpoints)

// Start monitoring when this module is imported
if (typeof window !== "undefined") {
  rpcManager.startMonitoring()
}

// Helper function to get a connection with the best available endpoint
export function getBestConnection(): Connection {
  return new Connection(rpcManager.getCurrentEndpoint())
}
