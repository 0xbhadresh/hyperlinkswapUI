export interface Token {
  symbol: string
  name: string
  icon: string
  balance: string
  value: string
  address?: string
  decimals?: number
}

export interface SwapInfo {
  inputAmount: string
  outputAmount: string
  totalGas: number
  gasPriceGwei: string
  gasUsd: number
  amountInUsd: number
  amountOutUsd: number
  receivedUsd: number
  swaps: Array<
    Array<{
      pool: string
      tokenIn: string
      tokenOut: string
      swapAmount: string
      amountOut: string
      limitReturnAmount: string
      maxPrice: string
      exchange: string
      poolLength: number
      poolType: string
    }>
  >
  tokens: {
    [address: string]: {
      address: string
      symbol: string
      name: string
      price: number
      decimals: number
    }
  }
  encodedSwapData: string
  routerAddress: string
}

export interface SwapParams {
  tokenIn: string
  tokenOut: string
  amountIn: string
  saveGas?: boolean
  slippageTolerance?: string
  isInBps?: boolean
  chargeFeeBy?: "currency_in" | "currency_out"
  feeReceiver?: string
  feeAmount?: string
  deadline?: string
  to?: string
  clientData?: string
}

