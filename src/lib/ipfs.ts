/**
 * IPFS helpers for uploading credential metadata.
 * Supports NFT.Storage (free) and Pinata.
 */

export interface CredentialMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
  external_url?: string;
}

/**
 * Build the ERC-721 compatible JSON metadata object for a credential.
 */
export function buildCredentialMetadata(params: {
  title: string;
  organization: string;
  description: string;
  skills: string[];
  category: string;
  startDate: number;
  endDate: number;
  owner: string;
}): CredentialMetadata {
  const attrs: CredentialMetadata["attributes"] = [
    { trait_type: "Organization", value: params.organization },
    { trait_type: "Category", value: params.category },
    { trait_type: "Start Date", value: new Date(params.startDate * 1000).toISOString().split("T")[0] },
    { trait_type: "Status", value: params.endDate === 0 ? "Active" : "Completed" },
    ...params.skills.map((s) => ({ trait_type: "Skill", value: s })),
  ];

  if (params.endDate > 0) {
    attrs.push({
      trait_type: "End Date",
      value: new Date(params.endDate * 1000).toISOString().split("T")[0],
    });
  }

  return {
    name: `${params.title} @ ${params.organization}`,
    description: params.description,
    image: "ipfs://QmPlaceholderImageHash/credential-nft.png",
    attributes: attrs,
    external_url: `https://on-chain-resume.vercel.app/verify/${params.owner}`,
  };
}

/**
 * Upload metadata JSON to IPFS via NFT.Storage.
 * Returns the ipfs:// URI.
 *
 * @see https://nft.storage
 */
export async function uploadMetadataToIPFS(metadata: CredentialMetadata): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY;

  if (!apiKey) {
    // In dev mode without an API key, return a placeholder URI
    console.warn("[IPFS] NFT_STORAGE_KEY not set. Returning placeholder URI.");
    return `ipfs://QmDevPlaceholder/${Date.now()}/metadata.json`;
  }

  const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });

  const res = await fetch("https://api.nft.storage/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[IPFS] Upload failed: ${err}`);
  }

  const data = await res.json();
  return `ipfs://${data.value.cid}/metadata.json`;
}
