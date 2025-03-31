"use client";

import { useState, useEffect } from "react";
import { Search, X, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Token } from "@/lib/types";
import { NATIVE_TOKEN_ADDRESS } from "@/services/swap-service";
import { useChains } from "wagmi";

interface TokenSelectorProps {
  onSelect: (token: Token) => void;
  onClose: () => void;
}

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

export default function TokenSelector({
  onSelect,
  onClose,
}: TokenSelectorProps) {
  const chains = useChains();
  const chain = chains[0];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        // Determine chain ID
        const chainId = chain?.id === 1 ? 1 : 56; // Default to BSC if not Ethereum

        // Fetch tokens from API
        const response = await fetch(
          `https://ks-setting.kyberswap.com/api/v1/tokens?page=1&pageSize=100&isWhitelisted=true&chainIds=${chainId}`
        );
        const data = await response.json();

        // Add native token based on chain
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

        // Transform API tokens to our Token format
        const transformedTokens: Token[] = data.data.tokens.map(
          (token: ApiToken) => ({
            symbol: token.symbol,
            name: token.name,
            icon: token.logoURI,
            balance: "0",
            value: "0",
            address: token.address,
            decimals: token.decimals,
          })
        );

        // Add native token at the start
        setTokens([nativeToken, ...transformedTokens]);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [chain]);

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularTokens = tokens.slice(0, 4); // Show first 4 tokens as popular

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Select a token on {chain?.name || "BSC"}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search by token name, token symbol or address"
                  className="pl-9 bg-zinc-800 border-zinc-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {popularTokens.map((token) => (
                  <Button
                    key={token.symbol}
                    variant="outline"
                    className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                    onClick={() => onSelect(token)}
                  >
                    <img
                      src={token.icon}
                      alt={token.symbol}
                      className="w-5 h-5 rounded-full mr-2"
                      onError={(e) => {
                        // Fallback to first letter if image fails to load
                        (e.target as HTMLImageElement).style.display = "none";
                        (
                          e.target as HTMLImageElement
                        ).nextElementSibling!.setAttribute(
                          "style",
                          "display: flex"
                        );
                      }}
                    />
                    <div className="w-5 h-5 rounded-full bg-blue-500 hidden items-center justify-center">
                      <span className="text-xs">{token.symbol.charAt(0)}</span>
                    </div>
                    {token.symbol}
                  </Button>
                ))}
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-1">
                {filteredTokens.map((token) => (
                  <div
                    key={token.address}
                    className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer"
                    onClick={() => onSelect(token)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={token.icon}
                        alt={token.symbol}
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          // Fallback to first letter if image fails to load
                          (e.target as HTMLImageElement).style.display = "none";
                          (
                            e.target as HTMLImageElement
                          ).nextElementSibling!.setAttribute(
                            "style",
                            "display: flex"
                          );
                        }}
                      />
                      <div className="w-8 h-8 rounded-full bg-blue-500 hidden items-center justify-center">
                        <span className="text-xs">
                          {token.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-zinc-400">
                          {token.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
