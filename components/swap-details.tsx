import { RefreshCw } from "lucide-react"

interface SwapDetailsProps {
  rate: string
  minimumReceived: string
  priceImpact: string
  gasEstimate?: string
}

export default function SwapDetails({ rate, minimumReceived, priceImpact, gasEstimate }: SwapDetailsProps) {
  return (
    <div className="border-t border-zinc-800 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">{rate}</span>
            <RefreshCw className="h-4 w-4 text-zinc-400" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Minimum Received</span>
          <span className="text-sm">{minimumReceived}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Price Impact</span>
          <span
            className={`text-sm ${
              Number.parseFloat(priceImpact) < 1
                ? "text-green-500"
                : Number.parseFloat(priceImpact) < 5
                  ? "text-yellow-500"
                  : "text-red-500"
            }`}
          >
            {priceImpact}
          </span>
        </div>

        {gasEstimate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Estimated Gas Fee</span>
            <span className="text-sm">{gasEstimate}</span>
          </div>
        )}
      </div>
    </div>
  )
}

