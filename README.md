# DeFi Token Swap Interface

Task For Tonken Swap Interface

Live link : https://hyperlink-practical.vercel.app/


# Demo Video

<iframe src="https://gateway.lighthouse.storage/ipfs/bafybeifwigmilvgvjadpwtpjez2tfoo256k3x3uhbitc3w54oqy6ckyc5a" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>

# Requirement of the Task

Objective:

Develop a simple crypto swap interface using Next.js and ethers.js that allows users to swap tokens and select between Ethereum and Binance Smart Chain.

Requirements: 1. Dropdown for Chain Selection
• Allow users to select either Ethereum or Binance Smart Chain.
• Update the UI and RPC provider accordingly. 2. Token Swap Interface
• Input fields for token selection (From & To).
• Input field for token amount.
• Swap button to execute the transaction. 3. Web3 Integration
• Detect the user’s wallet (MetaMask).
• Connect to the selected chain’s RPC.
• Fetch token balances for the selected network. 4. Execute Swap
• Use KyberSwap API
• Ensure the correct network is selected before executing the swap. 5. Basic Error Handling & UX
• Show loading states.
• Display error messages for insufficient balance or incorrect network.

## Tech Stack

### Core Technologies

- **Frontend Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Web3 Integration

- **Wallet Connection**: RainbowKit
- **Web3 Interaction**: wagmi v2
- **Chain Management**: viem
- **RPC Provider**: Public endpoints (configurable)

### UI Components

- **Component Library**: shadcn/ui
- **Icons**: Lucide Icons
- **Toast Notifications**: shadcn/ui toast

## API Integration

### KyberSwap API

I have used KyberSwap's aggregator API for:

- Token lists: `https://ks-setting.kyberswap.com/api/v1/tokens`
- Price quotes: `https://aggregator-api.kyberswap.com/{chain}/api/v1/routes`
- Swap execution data

Example API endpoints:

```typescript
// Token List
https://ks-setting.kyberswap.com/api/v1/tokens?page=1&pageSize=100&isWhitelisted=true&chainIds=1
https://ks-setting.kyberswap.com/api/v1/tokens?page=1&pageSize=100&isWhitelisted=true&chainIds=56

// Swap Quote
https://aggregator-api.kyberswap.com/ethereum/api/v1/routes
https://aggregator-api.kyberswap.com/bsc/api/v1/routes
```

## Core Components

This are the main components of the project:

### TokenSwap (`components/token-swap.tsx`)

Main component handling:

- Token selection
- Amount input
- Price calculation
- Swap execution
- Balance checking
- Transaction states

### TokenSelector (`components/token-selector.tsx`)

Handles:

- Token list display
- Token search
- Chain-specific token filtering

### SlippageSelector (`components/slippage-selector.tsx`)

Manages:

- Slippage tolerance settings
- Predefined slippage options

## Key Features Implementation

### 1. Chain Selection

- Uses wagmi's `useChains` hook
- Automatically updates RPC endpoints
- Refreshes token lists based on selected chain

### 2. Token Swap Interface

- Real-time price updates
- USD value conversion
- Gas cost estimation
- Minimum received amount calculation
- Price impact warning

### 3. Swap Execution

```typescript
// Approval process for ERC20 tokens
if (fromToken.address !== NATIVE_TOKEN_ADDRESS) {
  await writeContract({
    address: fromToken.address,
    abi: tokenAbi,
    functionName: "approve",
    args: [routerAddress, amount],
  });
}

// Execute swap
await writeContract({
  address: routerAddress,
  abi: routerAbi,
  functionName: "swap",
  args: [encodedSwapData],
  value: nativeValue,
});
```

### 5. Error Handling

- Balance checks
- Network validation
- Transaction failure handling
- User-friendly error messages

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file:

```env
NEXT_PUBLIC_PROJECT_ID=your_wallet_connect_project_id
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.
