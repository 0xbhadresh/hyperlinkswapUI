"use client";

import { useState } from "react";
import TokenSwap from "@/components/token-swap";
import Header from "@/components/header";

import { useAccount } from "wagmi";
export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <TokenSwap />
        </div>
      </main>
    </div>
  );
}
