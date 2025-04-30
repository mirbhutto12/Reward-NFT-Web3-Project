import { Connection } from "@solana/web3.js"
import { getRpcUrl } from "./utils"

export type AlertLevel = "info" | "warning" | "error"

export type NetworkAlert = {
  id: string
  message: string
  level: AlertLevel
  timestamp: number
  dismissed: boolean
}

class NetworkAlertManager {
  private alerts: NetworkAlert[] = []
  private checkInterval: NodeJS.Timeout | null = null
  private listeners: ((alerts: NetworkAlert[]) => void)[] = []

  constructor() {
    // Initialize with empty alerts
  }

  // Start monitoring for network issues
  public startMonitoring(checkIntervalMs = 60000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }

    // Check immediately
    this.checkNetworkHealth()

    // Then set up interval
    this.checkInterval = setInterval(() => {
      this.checkNetworkHealth()
    }, checkIntervalMs)
  }

  // Stop monitoring
  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  // Get all active (non-dismissed) alerts
  public getActiveAlerts(): NetworkAlert[] {
    return this.alerts.filter((alert) => !alert.dismissed)
  }

  // Dismiss an alert
  public dismissAlert(id: string): void {
    this.alerts = this.alerts.map((alert) => (alert.id === id ? { ...alert, dismissed: true } : alert))
    this.notifyListeners()
  }

  // Add a listener for alert changes
  public addListener(listener: (alerts: NetworkAlert[]) => void): () => void {
    this.listeners.push(listener)

    // Return function to remove listener
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Create a new alert
  private createAlert(message: string, level: AlertLevel): void {
    // Check if a similar alert already exists
    const existingSimilar = this.alerts.find((a) => a.message === message && a.level === level && !a.dismissed)

    if (!existingSimilar) {
      const newAlert: NetworkAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        message,
        level,
        timestamp: Date.now(),
        dismissed: false,
      }

      this.alerts.push(newAlert)
      this.notifyListeners()
    }
  }

  // Notify all listeners of alert changes
  private notifyListeners(): void {
    const activeAlerts = this.getActiveAlerts()
    this.listeners.forEach((listener) => listener(activeAlerts))
  }

  // Check network health and create alerts if needed
  private async checkNetworkHealth(): Promise<void> {
    try {
      const connection = new Connection(getRpcUrl())

      // Check if we can connect
      const startTime = performance.now()
      const version = await connection.getVersion()
      const endTime = performance.now()

      const latency = Math.round(endTime - startTime)

      // Check for high latency
      if (latency > 2000) {
        this.createAlert(`High network latency detected (${latency}ms). Transactions may be delayed.`, "warning")
      }

      // Get recent performance to check TPS
      const perfSamples = await connection.getRecentPerformanceSamples(5)
      if (perfSamples.length > 0) {
        const totalTxns = perfSamples.reduce((acc, sample) => acc + sample.numTransactions, 0)
        const totalSeconds = perfSamples.reduce((acc, sample) => acc + sample.samplePeriodSecs, 0)
        const tps = totalTxns / totalSeconds

        // Check for network congestion (high TPS for devnet)
        if (tps > 1000) {
          this.createAlert(
            `Network congestion detected (${Math.round(tps)} TPS). Transactions may be delayed.`,
            "warning",
          )
        }
      }
    } catch (error) {
      this.createAlert("Unable to connect to Solana network. Please check your internet connection.", "error")
    }
  }
}

// Create singleton instance
export const networkAlertManager = new NetworkAlertManager()

// Start monitoring when this module is imported
if (typeof window !== "undefined") {
  networkAlertManager.startMonitoring()
}
