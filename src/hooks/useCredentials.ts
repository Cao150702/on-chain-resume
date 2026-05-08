"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { sepolia, hardhat } from "wagmi/chains";
import { ON_CHAIN_RESUME_ABI, CONTRACT_ADDRESSES } from "@/lib/contract";
import type { CredentialOnChain, CredentialDisplay } from "@/types/credential";

function getContractAddress(chainId?: number): `0x${string}` {
  if (chainId === hardhat.id) return CONTRACT_ADDRESSES.hardhat;
  return CONTRACT_ADDRESSES.sepolia;
}

/**
 * Fetch all credential token IDs owned by a wallet, then batch-read their metadata.
 */
export function useCredentials(
  ownerAddress?: `0x${string}`,
  chainId?: number
) {
  const contractAddress = getContractAddress(chainId);

  // Step 1: Get list of token IDs
  const { data: tokenIds, isLoading: idsLoading } = useReadContract({
    address: contractAddress,
    abi: ON_CHAIN_RESUME_ABI,
    functionName: "getCredentialsByOwner",
    args: ownerAddress ? [ownerAddress] : undefined,
    query: { enabled: !!ownerAddress },
  });

  // Step 2: Batch read credential metadata for each token
  const credentialCalls = (tokenIds ?? []).map((id) => ({
    address: contractAddress,
    abi: ON_CHAIN_RESUME_ABI,
    functionName: "getCredential" as const,
    args: [id] as const,
  }));

  const { data: credentialResults, isLoading: credsLoading } = useReadContracts({
    contracts: credentialCalls,
    query: { enabled: (tokenIds ?? []).length > 0 },
  });

  const credentials: CredentialDisplay[] = [];

  if (tokenIds && credentialResults) {
    tokenIds.forEach((id, i) => {
      const result = credentialResults[i];
      if (result.status === "success" && result.result) {
        credentials.push({
          ...(result.result as CredentialOnChain),
          tokenId: Number(id),
          tokenURI: "",
          owner: ownerAddress!,
        });
      }
    });
  }

  return {
    credentials,
    isLoading: idsLoading || credsLoading,
    tokenCount: tokenIds?.length ?? 0,
  };
}
