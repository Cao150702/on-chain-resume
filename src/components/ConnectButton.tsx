"use client";

import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { Wallet, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [showDropdown, setShowDropdown] = useState(false);

  const networkName: Record<number, string> = {
    11155111: "Sepolia",
    80002: "Polygon Amoy",
    31337: "Localhost",
  };

  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-web3-border
                     bg-web3-card hover:border-web3-purple transition-all duration-200
                     text-sm font-mono text-white"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
          <span className="text-gray-400 text-xs">{networkName[chainId] ?? "Unknown"}</span>
          <span>{shortenAddress(address)}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-52 rounded-lg border border-web3-border
                          bg-web3-card shadow-xl z-50">
            <div className="p-3 border-b border-web3-border">
              <p className="text-xs text-gray-400">Connected as</p>
              <p className="text-sm font-mono text-white mt-0.5">{shortenAddress(address)}</p>
            </div>
            <button
              onClick={() => { disconnect(); setShowDropdown(false); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400
                         hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {connectors.slice(0, 2).map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-web3-purple hover:bg-purple-500 disabled:opacity-50
                     transition-all duration-200 text-sm text-white font-medium"
        >
          <Wallet size={14} />
          {isPending ? "Connecting…" : connector.name}
        </button>
      ))}
    </div>
  );
}
