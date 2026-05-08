// Contract ABI — generated from compiled artifact
// Run `npm run compile` to regenerate typechain types
export const ON_CHAIN_RESUME_ABI = [
  // Read
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getCredential",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "organization", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string[]", name: "skills", type: "string[]" },
          { internalType: "uint8", name: "category", type: "uint8" },
          { internalType: "uint256", name: "startDate", type: "uint256" },
          { internalType: "uint256", name: "endDate", type: "uint256" },
          { internalType: "address", name: "issuer", type: "address" },
          { internalType: "bool", name: "endorsed", type: "bool" },
          { internalType: "uint256", name: "endorsementCount", type: "uint256" },
        ],
        internalType: "struct OnChainResume.Credential",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner_", type: "address" }],
    name: "getCredentialsByOwner",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "endorser", type: "address" },
    ],
    name: "hasEndorsed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMinted",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  // Write
  {
    inputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "organization", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string[]", name: "skills", type: "string[]" },
      { internalType: "uint8", name: "category", type: "uint8" },
      { internalType: "uint256", name: "startDate", type: "uint256" },
      { internalType: "uint256", name: "endDate", type: "uint256" },
      { internalType: "string", name: "tokenURI_", type: "string" },
    ],
    name: "mintCredential",
    outputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "endorseCredential",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint8", name: "category", type: "uint8" },
      { indexed: false, internalType: "string", name: "title", type: "string" },
    ],
    name: "CredentialMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: true, internalType: "address", name: "endorser", type: "address" },
      { indexed: false, internalType: "uint256", name: "totalEndorsements", type: "uint256" },
    ],
    name: "CredentialEndorsed",
    type: "event",
  },
] as const;

// Contract addresses per network
export const CONTRACT_ADDRESSES = {
  sepolia: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  hardhat: (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_LOCAL || "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`,
} as const;
