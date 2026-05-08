"use client";

import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";
import { MintForm } from "@/components/MintForm";
import { Link2, ArrowLeft } from "lucide-react";

export default function MintPage() {
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

      <main className="max-w-lg mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Mint Credential</h1>
          <p className="text-sm text-gray-400">
            Your credential will be minted as an ERC-721 NFT on Sepolia testnet.
            Metadata is stored on IPFS.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-web3-border bg-web3-card">
          <MintForm />
        </div>
      </main>
    </div>
  );
}
