"use client";

import { http, createConfig } from "wagmi";
import { hardhat, sepolia, polygonAmoy } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id";

export const config = createConfig({
  chains: [sepolia, polygonAmoy, hardhat],
  connectors: [
    metaMask(),
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});
