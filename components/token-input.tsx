"use client";

import type React from "react";

import { useState } from "react";
import { ChevronDown, Copy, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Token } from "@/lib/types";
import TokenSelector from "@/components/token-selector";

interface TokenInputProps {
  label: string;
  token: Token;
  amount?: string;
  onAmountChange: (value: string) => void;
  onTokenSelect: (token: Token) => void;
  isOutput?: boolean;
  isLoading?: boolean;
  usdValue?: string;
}

export default function TokenInput({
  label,
  token,
  amount = "",
  onAmountChange,
  onTokenSelect,
  isOutput = false,
  isLoading = false,
  usdValue,
}: TokenInputProps) {
  const [showTokenSelector, setShowTokenSelector] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">{label}</span>
        {!isOutput && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-zinc-400 hover:text-white"
            >
              <Copy className="h-3 w-3 mr-1" />
              <span>0</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
        <div className="flex-1">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            disabled={isOutput}
            className="w-full bg-transparent text-3xl font-medium focus:outline-none disabled:opacity-100"
            placeholder="0"
          />
          <div className="text-sm text-zinc-400 mt-1">
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Calculating...
              </div>
            ) : (
              <>~${token.value}</>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 rounded-full px-3 py-2 h-auto"
          onClick={() => setShowTokenSelector(true)}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
              <span className="text-xs">{token.symbol.charAt(0)}</span>
            </div>
            <span>{token.symbol}</span>
          </div>
          <Info className="h-4 w-4 text-zinc-400" />
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {showTokenSelector && (
        <TokenSelector
          onSelect={(token) => {
            onTokenSelect(token);
            setShowTokenSelector(false);
          }}
          onClose={() => setShowTokenSelector(false)}
        />
      )}

      {usdValue && (
        <div className="text-right text-sm text-zinc-400">≈ ${usdValue}</div>
      )}
    </div>
  );
}
