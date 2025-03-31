"use client"

import { useState } from "react"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface WalletConnectProps {
  isConnected: boolean
  onConnect: () => void
}

export default function WalletConnect({ isConnected, onConnect }: WalletConnectProps) {
  const [showDialog, setShowDialog] = useState(false)

  const handleConnect = () => {
    onConnect()
    setShowDialog(false)
  }

  if (isConnected) {
    return (
      <Button
        variant="outline"
        className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:border-zinc-600"
      >
        <Wallet className="mr-2 h-4 w-4" />
        0x7a...3f4e
      </Button>
    )
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex justify-between items-center w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 p-4 h-auto"
            onClick={handleConnect}
          >
            <span className="font-medium">MetaMask</span>
            <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex justify-between items-center w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 p-4 h-auto"
            onClick={handleConnect}
          >
            <span className="font-medium">WalletConnect</span>
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex justify-between items-center w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 p-4 h-auto"
            onClick={handleConnect}
          >
            <span className="font-medium">Coinbase Wallet</span>
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

