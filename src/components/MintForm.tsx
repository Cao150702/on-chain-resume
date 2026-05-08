"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useMintCredential } from "@/hooks/useMintCredential";
import type { MintFormData } from "@/types/credential";
import { CREDENTIAL_CATEGORY_LABELS } from "@/types/credential";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const DEFAULT_FORM: MintFormData = {
  title: "",
  organization: "",
  description: "",
  skills: "",
  category: "WORK",
  startDate: "",
  endDate: "",
};

export function MintForm() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { mint, isTxPending, isConfirming, isConfirmed, txHash } = useMintCredential(chainId);

  const [form, setForm] = useState<MintFormData>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setError(null);

    try {
      await mint(form, address);
      setForm(DEFAULT_FORM);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const isLoading = isTxPending || isConfirming;

  if (!isConnected) {
    return (
      <div className="text-center py-12 text-gray-500">
        Connect your wallet to mint a credential.
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <CheckCircle2 className="text-green-400" size={40} />
        <h3 className="text-lg font-semibold text-white">Credential Minted!</h3>
        <p className="text-sm text-gray-400">Your credential NFT has been recorded on-chain.</p>
        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-web3-purple hover:underline font-mono"
          >
            View on Etherscan ↗
          </a>
        )}
        <button
          onClick={() => setForm(DEFAULT_FORM)}
          className="mt-2 px-4 py-2 rounded-lg bg-web3-card border border-web3-border
                     text-sm text-white hover:border-web3-purple transition-colors"
        >
          Mint Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Senior Frontend Engineer"
          required
          className="w-full px-3 py-2 rounded-lg bg-web3-dark border border-web3-border
                     text-white placeholder-gray-600 focus:outline-none focus:border-web3-purple
                     transition-colors text-sm"
        />
      </div>

      {/* Organization */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Organization *</label>
        <input
          name="organization"
          value={form.organization}
          onChange={handleChange}
          placeholder="e.g. Tencent / ETH Global / Self"
          required
          className="w-full px-3 py-2 rounded-lg bg-web3-dark border border-web3-border
                     text-white placeholder-gray-600 focus:outline-none focus:border-web3-purple
                     transition-colors text-sm"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Category *</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-web3-dark border border-web3-border
                     text-white focus:outline-none focus:border-web3-purple transition-colors text-sm"
        >
          {Object.entries(CREDENTIAL_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Briefly describe your role, responsibilities, or the skill…"
          className="w-full px-3 py-2 rounded-lg bg-web3-dark border border-web3-border
                     text-white placeholder-gray-600 focus:outline-none focus:border-web3-purple
                     transition-colors text-sm resize-none"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm text-gray-400 mb-1.5">
          Skills <span className="text-gray-600">(comma-separated)</span>
        </label>
        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="TypeScript, React, Solidity, wagmi"
          className="w-full px-3 py-2 rounded-lg bg-web3-dark border border-web3-border
                     text-white placeholder-gray-600 focus:outline-none focus:border-web3-purple
                     transition-colors text-sm font-mono"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Start Date *</label>
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-web3-dark border border-web3-border
                       text-white focus:outline-none focus:border-web3-purple transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            End Date <span className="text-gray-600">(leave blank if ongoing)</span>
          </label>
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-web3-dark border border-web3-border
                       text-white focus:outline-none focus:border-web3-purple transition-colors text-sm"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400 break-all">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 rounded-lg bg-web3-purple hover:bg-purple-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 text-sm text-white font-medium
                   flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            {isTxPending ? "Confirm in wallet…" : "Confirming on-chain…"}
          </>
        ) : (
          "Mint Credential NFT"
        )}
      </button>
    </form>
  );
}
