"use client"

import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"

interface SlippageSelectorProps {
  slippage: string
  onSlippageChange: (slippage: string) => void
}

export default function SlippageSelector({ slippage, onSlippageChange }: SlippageSelectorProps) {
  const options = ["0.05", "0.1", "0.5", "1", "Custom"]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Max Slippage:</span>
          <span className="text-sm font-medium">{slippage}%</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 rounded-full bg-zinc-800 p-1">
        {options.map((option) => (
          <Button
            key={option}
            variant="ghost"
            size="sm"
            className={`rounded-full px-4 py-1 h-auto text-sm ${
              slippage === option
                ? "bg-zinc-700 text-white border border-emerald-600"
                : "text-zinc-400 hover:text-white"
            }`}
            onClick={() => onSlippageChange(option)}
          >
            {option}
            {option !== "Custom" && "%"}
          </Button>
        ))}
      </div>
    </div>
  )
}

