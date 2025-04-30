"use client"

import { useState, useEffect } from "react"
import { rpcManager } from "@/lib/rpc-manager"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function RpcEndpoints() {
  const [endpoints, setEndpoints] = useState<any[]>([])
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const refreshEndpoints = () => {
    setLoading(true)
    setTimeout(() => {
      const allEndpoints = rpcManager.getAllEndpoints()
      setEndpoints(allEndpoints)
      setCurrentUrl(rpcManager.getCurrentEndpoint())
      setLoading(false)
    }, 500)
  }

  useEffect(() => {
    refreshEndpoints()

    // Refresh every 30 seconds
    const interval = setInterval(refreshEndpoints, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-theme-teal" />
      case "unavailable":
        return <XCircle className="h-4 w-4 text-theme-pink" />
      default:
        return <AlertCircle className="h-4 w-4 text-theme-yellow" />
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">RPC Endpoints</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshEndpoints}
          disabled={loading}
          className="text-white border-white/20 hover:bg-white/10"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      <div className="space-y-3">
        {endpoints.map((endpoint) => (
          <div
            key={endpoint.url}
            className={`bg-white/5 p-3 rounded-lg ${endpoint.url === currentUrl ? "border border-theme-teal" : ""}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(endpoint.status)}
                  <span className="text-white font-medium">{endpoint.name}</span>
                  {endpoint.url === currentUrl && (
                    <span className="bg-theme-teal text-theme-dark text-xs px-2 py-0.5 rounded-full">Active</span>
                  )}
                </div>
                <p className="text-white/70 text-xs mt-1 break-all">{endpoint.url}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs">Priority: {endpoint.priority}</p>
                {endpoint.latency && <p className="text-white/70 text-xs">Latency: {endpoint.latency}ms</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
