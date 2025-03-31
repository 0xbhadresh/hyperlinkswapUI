import type { SwapInfo, SwapParams } from "@/lib/types";

const API_BASE_URL = "https://aggregator-api.kyberswap.com";

export async function getSwapInfo(
  chain: string,
  params: SwapParams
): Promise<SwapInfo> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();

    // Required parameters
    queryParams.append("tokenIn", params.tokenIn);
    queryParams.append("tokenOut", params.tokenOut);
    queryParams.append("amountIn", params.amountIn);

    // Optional parameters
    if (params.saveGas !== undefined) {
      queryParams.append("saveGas", params.saveGas ? "true" : "false");
    }

    if (params.slippageTolerance) {
      queryParams.append("slippageTolerance", params.slippageTolerance);
    }

    if (params.isInBps !== undefined) {
      queryParams.append("isInBps", params.isInBps ? "true" : "false");
    }

    if (params.chargeFeeBy) {
      queryParams.append("chargeFeeBy", params.chargeFeeBy);
    }

    if (params.feeReceiver) {
      queryParams.append("feeReceiver", params.feeReceiver);
    }

    if (params.feeAmount) {
      queryParams.append("feeAmount", params.feeAmount);
    }

    if (params.deadline) {
      queryParams.append("deadline", params.deadline);
    }

    if (params.to) {
      queryParams.append("to", params.to);
    }

    if (params.clientData) {
      queryParams.append("clientData", params.clientData);
    }

    // Make the API call
    const response = await fetch(
      `${API_BASE_URL}/${chain}/route/encode?${queryParams.toString()}`,
      {
        headers: {
          "X-Client-Id": "Latest",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("DAttaaa::?//", data);
    return data as SwapInfo;
  } catch (error) {
    console.error("Error fetching swap info:", error);
    throw error;
  }
}

// Helper function to format token amounts based on decimals
export function formatTokenAmount(amount: string, decimals: number): string {
  const value = BigInt(amount);
  // Use multiplication to calculate the divisor instead of exponentiation
  let divisor = BigInt(1);
  for (let i = 0; i < decimals; i++) {
    divisor *= BigInt(10);
  }
  const integerPart = value / divisor;
  const fractionalPart = value % divisor;

  // Format the fractional part to have leading zeros
  let fractionalStr = fractionalPart.toString();
  while (fractionalStr.length < decimals) {
    fractionalStr = "0" + fractionalStr;
  }

  // Trim trailing zeros
  fractionalStr = fractionalStr.replace(/0+$/, "");

  if (fractionalStr === "") {
    return integerPart.toString();
  }

  return `${integerPart}.${fractionalStr}`;
}

// Convert from human readable amount to wei (token units)
export function toTokenUnits(amount: string, decimals: number): string {
  if (!amount || isNaN(Number(amount))) return "0";

  const parts = amount.split(".");
  const wholePart = parts[0];
  const fractionalPart = parts.length > 1 ? parts[1] : "";

  // Use multiplication to calculate the value instead of exponentiation
  let wei = BigInt(wholePart);
  for (let i = 0; i < decimals; i++) {
    wei *= BigInt(10);
  }

  if (fractionalPart) {
    const paddedFractionalPart = fractionalPart
      .padEnd(decimals, "0")
      .slice(0, decimals);
    wei += BigInt(paddedFractionalPart);
  }

  return wei.toString();
}

// Native token address constant
export const NATIVE_TOKEN_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
