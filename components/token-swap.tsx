"use client";

import { useState, useEffect } from "react";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import TokenInput from "@/components/token-input";
import SlippageSelector from "@/components/slippage-selector";
import SwapDetails from "@/components/swap-details";
import type { Token, SwapInfo } from "@/lib/types";
import { useAccount } from "wagmi";
import {
  getSwapInfo,
  formatTokenAmount,
  toTokenUnits,
  NATIVE_TOKEN_ADDRESS,
} from "@/services/swap-service";
import { useToast } from "@/components/ui/use-toast";

export default function TokenSwap() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [fromToken, setFromToken] = useState<Token>({
    symbol: "ETH",
    name: "Ethereum",
    icon: "/ethereum.svg",
    balance: "1.783918",
    value: "3178",
    address: NATIVE_TOKEN_ADDRESS,
    decimals: 18,
  });

  const [toToken, setToToken] = useState<Token>({
    symbol: "USDC",
    name: "USD Coin",
    icon: "/usdc.svg",
    balance: "0",
    value: "0",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  });

  const [fromAmount, setFromAmount] = useState("1.783918");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [swapInfo, setSwapInfo] = useState<SwapInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedChain, setSelectedChain] = useState("ethereum");

  useEffect(() => {
    // Fetch swap info when input amount or tokens change
    const fetchSwapInfo = async () => {
      if (
        !fromToken.address ||
        !toToken.address ||
        !fromAmount ||
        Number(fromAmount) <= 0
      ) {
        setToAmount("");
        setSwapInfo(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Convert input amount to token units (wei)
        const amountInWei = toTokenUnits(fromAmount, fromToken.decimals || 18);

        const params = {
          tokenIn: fromToken.address,
          tokenOut: toToken.address,
          amountIn: amountInWei,
          slippageTolerance: (Number(slippage) * 10).toString(), // Convert to BIPs (0.5% -> 50 BIPs)
          to: "0x0000000000000000000000000000000000000000", // Replace with actual user address when connected
        };

        const data = await getSwapInfo(selectedChain, params);
        setSwapInfo(data);

        // Format the output amount based on token decimals
        if (data.outputAmount) {
          const formattedAmount = formatTokenAmount(
            data.outputAmount,
            toToken.decimals || 6
          );
          setToAmount(formattedAmount);
        }
      } catch (err) {
        console.error("Error fetching swap info:", err);
        setError("Failed to get swap quote. Please try again.");
        toast({
          title: "Error",
          description: "Failed to get swap quote. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call to avoid too many requests
    const timer = setTimeout(() => {
      fetchSwapInfo();
    }, 500);

    return () => clearTimeout(timer);
  }, [fromToken, toToken, fromAmount, slippage, selectedChain, toast]);

  const handleSwapPositions = () => {
    // Swap token positions
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    // Reset amounts
    setFromAmount(toAmount);
    setToAmount("");
    setSwapInfo(null);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleFromTokenSelect = (token: Token) => {
    setFromToken(token);
  };

  const handleToTokenSelect = (token: Token) => {
    setToToken(token);
  };

  const handleSwap = () => {
    // Here you would implement the actual swap execution
    // using the encodedSwapData from swapInfo
    toast({
      title: "Swap initiated",
      description: `Swapping ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`,
    });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white shadow-xl">
      <CardContent className="p-0">
        <div className="p-4">
          <TokenInput
            label="You pay"
            token={fromToken}
            amount={fromAmount}
            onAmountChange={handleFromAmountChange}
            onTokenSelect={handleFromTokenSelect}
          />
        </div>

        <div className="relative flex justify-center">
          <div className="absolute -mt-3 bg-zinc-800 rounded-full p-1.5 border border-zinc-700">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full bg-zinc-800 hover:bg-zinc-700"
              onClick={handleSwapPositions}
              disabled={isLoading}
            >
              <ArrowDownUp className="h-4 w-4" />
              <span className="sr-only">Switch tokens</span>
            </Button>
          </div>
        </div>

        <div className="p-4 pt-6">
          <div className="flex items-center mb-2">
            <span className="text-sm text-zinc-400">Est. Output</span>
            {isLoading && (
              <Loader2 className="ml-2 h-3 w-3 animate-spin text-zinc-400" />
            )}
          </div>
          <TokenInput
            label="You receive"
            token={toToken}
            amount={toAmount}
            onAmountChange={() => {}}
            onTokenSelect={handleToTokenSelect}
            isOutput
            isLoading={isLoading}
          />
        </div>

        <div className="px-4 pb-4">
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
          />
        </div>

        {swapInfo && (
          <SwapDetails
            rate={`1 ${fromToken.symbol} = ${formatTokenAmount(
              swapInfo.outputAmount,
              toToken.decimals || 6
            )} ${toToken.symbol}`}
            minimumReceived={`${formatTokenAmount(
              (
                (BigInt(swapInfo.outputAmount) *
                  BigInt(1000 - Number(slippage) * 10)) /
                BigInt(1000)
              ).toString(),
              toToken.decimals || 6
            )} ${toToken.symbol}`}
            priceImpact={
              swapInfo.amountOutUsd > 0
                ? `${(
                    (1 - swapInfo.amountOutUsd / swapInfo.amountInUsd) *
                    100
                  ).toFixed(2)}%`
                : "< 0.01%"
            }
            gasEstimate={`~$${swapInfo.gasUsd.toFixed(4)}`}
          />
        )}

        {error && <div className="px-4 py-2 text-red-400 text-sm">{error}</div>}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-6"
          onClick={handleSwap}
          disabled={
            isLoading || !swapInfo || !fromAmount || Number(fromAmount) <= 0
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : !isConnected ? (
            "Connect Wallet"
          ) : !swapInfo ? (
            "Enter an amount"
          ) : (
            "Swap"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
