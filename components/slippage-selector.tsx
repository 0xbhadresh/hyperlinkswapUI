"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

interface SlippageSelectorProps {
  slippage: string;
  onSlippageChange: (slippage: string) => void;
}

export default function SlippageSelector({
  slippage,
  onSlippageChange,
}: SlippageSelectorProps) {
  // Only use whole numbers for simplicity
  const options = ["1.0", "2.0", "3.0"];

  const handleSlippageChange = (value: string) => {
    // Parse and format the number to ensure consistency
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
      // Format to one decimal place
      onSlippageChange(numValue.toFixed(1));
    }
  };

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
            onClick={() => handleSlippageChange(option)}
          >
            {option}%
          </Button>
        ))}
      </div>
    </div>
  );
}
