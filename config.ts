import { http, createConfig } from "@wagmi/core";
import { bsc, mainnet } from "@wagmi/core/chains";

export const config = createConfig({
  chains: [mainnet, bsc],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
  },
});
