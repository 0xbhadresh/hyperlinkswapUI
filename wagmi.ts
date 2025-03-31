import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { bsc, mainnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, bsc],
  ssr: true,
});
