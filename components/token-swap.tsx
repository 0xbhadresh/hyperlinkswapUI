"use client";

import { useState, useEffect } from "react";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import TokenInput from "@/components/token-input";
import SlippageSelector from "@/components/slippage-selector";
import SwapDetails from "@/components/swap-details";
import type { Token, SwapInfo } from "@/lib/types";
import {
  useAccount,
  useChains,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  getSwapInfo,
  formatTokenAmount,
  toTokenUnits,
  NATIVE_TOKEN_ADDRESS,
} from "@/services/swap-service";
import { useToast } from "@/components/ui/use-toast";
import { parseUnits } from "viem";

interface ApiToken {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  isWhitelisted: boolean;
  isStable: boolean;
}

export default function TokenSwap() {
  const { address, isConnected } = useAccount();
  const chains = useChains();
  const chain = chains[0];
  const { toast } = useToast();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [swapInfo, setSwapInfo] = useState<SwapInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [isPending, setIsPending] = useState(false);

  // Fetch initial tokens
  useEffect(() => {
    const fetchInitialTokens = async () => {
      try {
        const chainId = chain?.id === 1 ? 1 : 56;

        // Create native token based on chain
        const nativeToken: Token =
          chain?.id === 1
            ? {
                symbol: "ETH",
                name: "Ethereum",
                icon: "/ethereum.svg",
                balance: "0",
                value: "0",
                address: NATIVE_TOKEN_ADDRESS,
                decimals: 18,
              }
            : {
                symbol: "BNB",
                name: "Binance Coin",
                icon: "/bnb.svg",
                balance: "0",
                value: "0",
                address: NATIVE_TOKEN_ADDRESS,
                decimals: 18,
              };

        // Fetch tokens from API
        const response = await fetch(
          `https://ks-setting.kyberswap.com/api/v1/tokens?page=1&pageSize=100&isWhitelisted=true&chainIds=${chainId}`
        );
        const data = await response.json();

        // Find USDC or USDT as default quote token
        const stablecoin = data.data.tokens.find(
          (token: ApiToken) =>
            token.symbol === "USDC" || token.symbol === "USDT"
        );

        if (stablecoin) {
          const quoteToken: Token = {
            symbol: stablecoin.symbol,
            name: stablecoin.name,
            icon: stablecoin.logoURI,
            balance: "0",
            value: "0",
            address: stablecoin.address,
            decimals: stablecoin.decimals,
          };

          setFromToken(nativeToken);
          setToToken(quoteToken);
        }
      } catch (error) {
        console.error("Error fetching initial tokens:", error);
        toast({
          title: "Error",
          description: "Failed to load initial tokens. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchInitialTokens();
  }, [chain, toast]);

  useEffect(() => {
    // Only fetch swap info when we have both tokens
    if (!fromToken || !toToken) return;

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

        const amountInWei = toTokenUnits(fromAmount, fromToken.decimals);

        const params = {
          tokenIn: fromToken.address,
          tokenOut: toToken.address,
          amountIn: amountInWei,
          slippageTolerance: (Number(slippage) * 10).toString(),
          to: address || "0x0000000000000000000000000000000000000000",
        };

        const data = await getSwapInfo(selectedChain, params);
        setSwapInfo(data);

        if (data.outputAmount) {
          const formattedAmount = formatTokenAmount(
            data.outputAmount,
            toToken.decimals
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

    const timer = setTimeout(() => {
      fetchSwapInfo();
    }, 500);

    return () => clearTimeout(timer);
  }, [fromToken, toToken, fromAmount, slippage, selectedChain, address, toast]);

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

  const handleSwap = async () => {
    if (!swapInfo || !fromToken || !toToken || !isConnected) return;

    try {
      setIsPending(true);
      setError(null);

      // Prepare approval if needed (for non-native tokens)
      if (fromToken.address !== NATIVE_TOKEN_ADDRESS) {
        const tokenAbi = [
          {
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            name: "approve",
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ];

        // Approve router to spend tokens
        await writeContract({
          address: fromToken.address as `0x${string}`,
          abi: tokenAbi,
          functionName: "approve",
          args: [
            swapInfo.routerAddress as `0x${string}`,
            parseUnits(fromAmount, fromToken.decimals),
          ],
        });
      }

      // Execute swap
      const routerAbi = [
        {
          inputs: [{ name: "rawData", type: "bytes" }],
          name: "swap",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ];

      const value =
        fromToken.address === NATIVE_TOKEN_ADDRESS
          ? parseUnits(fromAmount, 18)
          : BigInt(0);

      await writeContract({
        address: swapInfo.routerAddress as `0x${string}`,
        abi: routerAbi,
        functionName: "swap",
        args: [swapInfo.encodedSwapData as `0x${string}`],
        value,
      });

      toast({
        title: "Swap initiated",
        description: `Swapping ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`,
      });
    } catch (err) {
      console.error("Swap error:", err);
      setError(
        "Failed to execute swap. Please ensure you have enough balance and try again."
      );
      toast({
        title: "Error",
        description:
          "Failed to execute swap. Please ensure you have enough balance and try again.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  if (!fromToken || !toToken) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 text-white shadow-xl">
        <CardContent className="p-4 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

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
              toToken.decimals
            )} ${toToken.symbol}`}
            minimumReceived={`${formatTokenAmount(
              (
                (BigInt(swapInfo.outputAmount) *
                  BigInt(1000 - Number(slippage) * 10)) /
                BigInt(1000)
              ).toString(),
              toToken.decimals
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
            isLoading ||
            isPending ||
            isConfirming ||
            !swapInfo ||
            !fromAmount ||
            Number(fromAmount) <= 0
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading quote...
            </>
          ) : isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Waiting for approval...
            </>
          ) : isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming transaction...
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
