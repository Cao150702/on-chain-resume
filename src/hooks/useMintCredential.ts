"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ON_CHAIN_RESUME_ABI, CONTRACT_ADDRESSES } from "@/lib/contract";
import { CREDENTIAL_CATEGORY_ENUM } from "@/types/credential";
import type { MintFormData } from "@/types/credential";
import { buildCredentialMetadata, uploadMetadataToIPFS } from "@/lib/ipfs";

export function useMintCredential(chainId?: number) {
  const contractAddress = chainId === 31337
    ? CONTRACT_ADDRESSES.hardhat
    : CONTRACT_ADDRESSES.sepolia;

  const { writeContractAsync, isPending: isTxPending, data: txHash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const mint = async (form: MintFormData, ownerAddress: `0x${string}`) => {
    const startTs = Math.floor(new Date(form.startDate).getTime() / 1000);
    const endTs = form.endDate
      ? Math.floor(new Date(form.endDate).getTime() / 1000)
      : 0;

    const skills = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Upload metadata to IPFS first
    const metadata = buildCredentialMetadata({
      title: form.title,
      organization: form.organization,
      description: form.description,
      skills,
      category: form.category,
      startDate: startTs,
      endDate: endTs,
      owner: ownerAddress,
    });

    const tokenUri = await uploadMetadataToIPFS(metadata);

    // Submit on-chain transaction
    const hash = await writeContractAsync({
      address: contractAddress,
      abi: ON_CHAIN_RESUME_ABI,
      functionName: "mintCredential",
      args: [
        form.title,
        form.organization,
        form.description,
        skills,
        CREDENTIAL_CATEGORY_ENUM[form.category],
        BigInt(startTs),
        BigInt(endTs),
        tokenUri,
      ],
    });

    return hash;
  };

  return {
    mint,
    isTxPending,
    isConfirming,
    isConfirmed,
    txHash,
  };
}
