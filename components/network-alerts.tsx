"use client"

import { useState, useEffect } from "react"
import { networkAlertManager, type NetworkAlert } from "@/lib/network-alerts"
import { AlertCircle, Info, AlertTriangle, X } from "lucide-react"

export function NetworkAlerts() {
  const [alerts, setAlerts] = useState<NetworkAlert[]>([])

  useEffect(() => {
    // Subscribe to alert changes
    const unsubscribe = networkAlertManager.addListener((newAlerts) => {
      setAlerts(newAlerts)
    })

    // Initial fetch
    setAlerts(networkAlertManager.getActiveAlerts())

    return unsubscribe
  }, [])

  const dismissAlert = (id: string) => {
    networkAlertManager.dismissAlert(id)
  }

  if (alerts.length === 0) {
    return null
  }

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-theme-pink" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-theme-yellow" />
      default:
        return <Info className="h-5 w-5 text-theme-teal" />
    }
  }

  const getAlertClass = (level: string) => {
    switch (level) {
      case "error":
        return "bg-theme-pink/20 border-theme-pink/50"
      case "warning":
        return "bg-theme-yellow/20 border-theme-yellow/50"
      default:
        return "bg-theme-teal/20 border-theme-teal/50"
    }
  }

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert) => (
        <div key={alert.id} className={`p-3 rounded-lg border ${getAlertClass(alert.level)} flex items-start gap-3`}>
          {getAlertIcon(alert.level)}
          <div className="flex-1">
            <p className="text-white">{alert.message}</p>
            <p className="text-white/70 text-xs mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
          </div>
          <button onClick={() => dismissAlert(alert.id)} className="text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
