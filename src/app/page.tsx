"use client";

import { useAccount, useChainId } from "wagmi";
import Link from "next/link";
import { ConnectButton } from "@/components/ConnectButton";
import { CredentialCard } from "@/components/CredentialCard";
import { useCredentials } from "@/hooks/useCredentials";
import { Link2, PlusCircle, Search, Shield, Zap, FileCheck } from "lucide-react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { credentials, isLoading } = useCredentials(address, chainId);

  return (
    <div className="min-h-screen bg-web3-dark grid-bg">
      {/* Header */}
      <header className="border-b border-web3-border bg-web3-dark/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-web3-purple" />
            <span className="font-semibold text-white">OnChainResume</span>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-web3-purple/20
                             text-purple-300 border border-purple-500/20">beta</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/verify"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <Search size={13} />
              <span className="hidden sm:inline">Verify</span>
            </Link>
            <ConnectButton />
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-web3-purple/10
                          border border-purple-500/20 text-purple-300 text-xs mb-4">
            <Shield size={11} />
            Tamper-proof · On-chain · Verifiable
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Your Resume,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-web3-purple to-web3-cyan">
              On the Blockchain
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Mint your work experience and skills as NFTs. Share your wallet address.
            Let any recruiter trustlessly verify your credentials — no PDF, no forgery.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link
              href="/mint"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-web3-purple
                         hover:bg-purple-500 transition-colors text-white font-medium text-sm"
            >
              <PlusCircle size={15} />
              Mint Credential
            </Link>
            <Link
              href="/verify"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg
                         border border-web3-border hover:border-web3-purple
                         transition-colors text-white text-sm"
            >
              <Search size={15} />
              Verify a Wallet
            </Link>
          </div>
        </div>

        {/* Feature tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: <Shield size={20} className="text-web3-purple" />,
              title: "Trustless Verification",
              desc: "Credentials stored on-chain. Any recruiter can verify without contacting you.",
            },
            {
              icon: <Zap size={20} className="text-yellow-400" />,
              title: "Instant Endorsements",
              desc: "Colleagues & managers co-sign on-chain — like LinkedIn recommendations, but immutable.",
            },
            {
              icon: <FileCheck size={20} className="text-green-400" />,
              title: "IPFS Metadata",
              desc: "Rich JSON metadata (description, skills, dates) stored on IPFS via NFT.Storage.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-4 rounded-xl border border-web3-border bg-web3-card hover:border-web3-purple/40 transition-colors"
            >
              <div className="p-2 w-fit rounded-lg bg-web3-dark mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* My Credentials */}
        {isConnected ? (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">My Credentials</h2>
              <Link
                href="/mint"
                className="flex items-center gap-1.5 text-sm text-web3-purple hover:text-purple-300 transition-colors"
              >
                <PlusCircle size={14} />
                Add New
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-40 rounded-xl border border-web3-border bg-web3-card animate-pulse" />
                ))}
              </div>
            ) : credentials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {credentials.map((cred) => (
                  <CredentialCard key={cred.tokenId} credential={cred} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-web3-border rounded-xl">
                <FileCheck size={32} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">No credentials yet.</p>
                <Link
                  href="/mint"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                             bg-web3-purple hover:bg-purple-500 transition-colors text-white text-sm"
                >
                  <PlusCircle size={14} />
                  Mint Your First Credential
                </Link>
              </div>
            )}
          </section>
        ) : (
          <div className="text-center py-16 border border-dashed border-web3-border rounded-xl">
            <p className="text-gray-500 text-sm">Connect your wallet to view or mint credentials.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-web3-border mt-16 py-6 text-center text-xs text-gray-600">
        <p>
          OnChainResume · ERC-721 Credential NFTs ·{" "}
          <a
            href="https://github.com/Cao150702/on-chain-resume"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
        </p>
      </footer>
    </div>
  );
}
