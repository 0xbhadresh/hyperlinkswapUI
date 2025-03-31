"use client";

import { useState } from "react";
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
import { getChainId } from "@wagmi/core";
import { config } from "../config";

const chainId = getChainId(config);
console.log("Chain ID:::::", chainId);

interface TokenSelectorProps {
  onSelect: (token: Token) => void;
  onClose: () => void;
}

export default function TokenSelector({
  onSelect,
  onClose,
}: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Common tokens with addresses
  const popularTokens: Token[] = [
    {
      symbol: "BNB",
      name: "Binance Coin",
      icon: "/bnb.svg",
      balance: "0",
      value: "0",
      address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
      decimals: 18,
    },
    {
      symbol: "WBNB",
      name: "Wrapped BNB",
      icon: "/wbnb.svg",
      balance: "0",
      value: "0",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      decimals: 18,
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      icon: "/dai.svg",
      balance: "0",
      value: "0",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      icon: "/usdc.svg",
      balance: "0",
      value: "0",
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      decimals: 6,
    },
    {
      symbol: "USDT",
      name: "Tether",
      icon: "/usdt.svg",
      balance: "0",
      value: "0",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
    },
    {
      symbol: "BUSD",
      name: "Binance USD",
      icon: "/busd.svg",
      balance: "0",
      value: "0",
      address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
      decimals: 18,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: "/ethereum.svg",
      balance: "0",
      value: "0",
      address: NATIVE_TOKEN_ADDRESS,
      decimals: 18,
    },
    {
      symbol: "BTCB",
      name: "Bitcoin BEP2",
      icon: "/btcb.svg",
      balance: "0",
      value: "0",
      address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      decimals: 18,
    },
  ];

  const allTokens: Token[] = [
    {
      symbol: "1INCH",
      name: "1inch Network",
      icon: "/1inch.svg",
      balance: "0",
      value: "0",
      address: "0x111111111117dC0aa78b770fA6A738034120C302",
      decimals: 18,
    },
    {
      symbol: "AI",
      name: "Any Inu",
      icon: "/ai.svg",
      balance: "0",
      value: "0",
      address: "0x5BA18a4B4a34366C056e6e2Aa2c8245F7A9c9F3F",
      decimals: 18,
    },
    {
      symbol: "ankrMATIC",
      name: "Ankr Staked MATIC",
      icon: "/ankrmatic.svg",
      balance: "0",
      value: "0",
      address: "0x0E9b89007eEE9c958c0EDA24eF70723C2C93dD58",
      decimals: 18,
    },
    {
      symbol: "ATH",
      name: "AETHR Token",
      icon: "/ath.svg",
      balance: "0",
      value: "0",
      address: "0x8774Fb0Ac72281e9053240E3e7F2F5e71F98F764",
      decimals: 18,
    },
    {
      symbol: "axlUSDC",
      name: "Axelar Wrapped USDC",
      icon: "/axlusdc.svg",
      balance: "0",
      value: "0",
      address: "0x750e4C4984a9e0f12978eA6742Bc1c5D248f40ed",
      decimals: 6,
    },
    {
      symbol: "axlWMAI",
      name: "Axelar Wrapped WMAI",
      icon: "/axlwmai.svg",
      balance: "0",
      value: "0",
      address: "0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b",
      decimals: 18,
    },
  ];

  const filteredTokens = allTokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Select a token</DialogTitle>
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
          <p className="text-sm text-zinc-400">
            You can search and select{" "}
            <span className="text-white">any token</span> on KyberSwap.
          </p>

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
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                  <span className="text-xs">{token.symbol.charAt(0)}</span>
                </div>
                {token.symbol}
              </Button>
            ))}
          </div>

          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-2 bg-zinc-800">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-zinc-700"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="imported"
                className="data-[state=active]:bg-zinc-700"
              >
                Imported
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="max-h-[300px] overflow-y-auto pr-1">
            {filteredTokens.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-3 hover:bg-zinc-800 rounded-lg cursor-pointer"
                onClick={() => onSelect(token)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-xs">{token.symbol.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-zinc-400">{token.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
