"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-zinc-900 border-b border-zinc-800 py-4 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-white mr-8">
            SwapDEX
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6"></nav>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-zinc-300"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Connect Wallet Button (Desktop) */}
        <div className="hidden md:block">
          <ConnectButton />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-50 transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-screen py-4" : "max-h-0 overflow-hidden"
        )}
      >
        <nav className="flex flex-col space-y-4 px-4">
          <div className="pt-2">
            <ConnectButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
