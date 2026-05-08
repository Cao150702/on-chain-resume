"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";
import { CredentialCard } from "@/components/CredentialCard";
import { useCredentials } from "@/hooks/useCredentials";
import { useChainId } from "wagmi";
import { isAddress } from "viem";
import { Link2, Search, ArrowLeft, Loader2 } from "lucide-react";

export default function VerifyPage() {
  const [input, setInput] = useState("");
  const [queryAddress, setQueryAddress] = useState<`0x${string}` | undefined>();
  const [inputError, setInputError] = useState("");

  const chainId = useChainId();
  const { credentials, isLoading } = useCredentials(queryAddress, chainId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddress(input)) {
      setInputError("Please enter a valid Ethereum address (0x…)");
      return;
    }
    setInputError("");
    setQueryAddress(input as `0x${string}`);
  };

  return (
    <div className="min-h-screen bg-web3-dark grid-bg">
      <header className="border-b border-web3-border bg-web3-dark/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Link2 size={18} className="text-web3-purple" />
            <span className="font-semibold text-white">OnChainResume</span>
          </Link>
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Verify Credentials</h1>
          <p className="text-sm text-gray-400">
            Enter any wallet address to view their on-chain credentials and endorsements.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0x... wallet address"
            className="flex-1 px-4 py-2.5 rounded-lg bg-web3-card border border-web3-border
                       text-white placeholder-gray-600 focus:outline-none focus:border-web3-purple
                       transition-colors text-sm font-mono"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-web3-purple
                       hover:bg-purple-500 transition-colors text-white text-sm font-medium"
          >
            <Search size={15} />
            Search
          </button>
        </form>

        {inputError && (
          <p className="text-xs text-red-400 mb-4">{inputError}</p>
        )}

        {queryAddress && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Showing credentials for</p>
                <p className="font-mono text-sm text-white">{queryAddress}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-web3-card border border-web3-border text-gray-400">
                {credentials.length} credential{credentials.length !== 1 ? "s" : ""}
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Reading from blockchain…</span>
              </div>
            ) : credentials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {credentials.map((cred) => (
                  <CredentialCard
                    key={cred.tokenId}
                    credential={cred}
                    canEndorse={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-web3-border rounded-xl">
                <p className="text-gray-500 text-sm">No credentials found for this address.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
