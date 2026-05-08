# On-Chain Resume 🔗

> **A decentralized portfolio & credential NFT dApp** — mint your skills and work experience as verifiable on-chain records that any HR or recruiter can trustlessly verify.

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue?logo=solidity)](https://soliditylang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

![on-chain-resume-preview](docs/preview.png)

## ✨ Features

- **Mint Credential NFTs** — Encode skills, certifications, and work experience as ERC-721 tokens with on-chain metadata
- **Tamper-proof** — Once minted, credentials are immutable and verifiable by anyone
- **Wallet-based Identity** — Connect MetaMask / WalletConnect; your address IS your identity
- **On-chain Verification** — Recruiters scan your wallet address to see all issued credentials
- **Endorsement System** — Third parties (ex-managers, collaborators) can sign endorsements on-chain
- **IPFS Metadata** — Rich JSON metadata stored on IPFS via Pinata/NFT.Storage
- **Multi-chain Support** — Deployed on Sepolia testnet; Polygon Amoy config included

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Web3 Client | wagmi v2, viem, RainbowKit |
| Smart Contract | Solidity 0.8.24, OpenZeppelin ERC-721 |
| Dev Environment | Hardhat, TypeChain |
| Metadata Storage | IPFS (via NFT.Storage) |
| Deployment | Vercel (frontend), Sepolia testnet |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask browser extension
- Sepolia testnet ETH (from [faucet](https://sepoliafaucet.com))

### Installation

```bash
git clone https://github.com/Cao150702/on-chain-resume.git
cd on-chain-resume
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
# Fill in your own keys
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | [WalletConnect Cloud](https://cloud.walletconnect.com) project ID |
| `NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA` | Deployed contract address on Sepolia |
| `PRIVATE_KEY` | Deployer wallet private key (never commit!) |
| `SEPOLIA_RPC_URL` | Alchemy / Infura Sepolia endpoint |
| `ETHERSCAN_API_KEY` | For contract verification |

### Run Locally (against local Hardhat node)

```bash
# Terminal 1 — start local blockchain
npm run node

# Terminal 2 — deploy contract to local node
npm run deploy:local

# Terminal 3 — start frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Testnet

```bash
npm run deploy:sepolia
```

## 📁 Project Structure

```
on-chain-resume/
├── contracts/
│   └── OnChainResume.sol        # ERC-721 credential NFT contract
├── scripts/
│   └── deploy.ts                # Hardhat deployment script
├── test/
│   └── OnChainResume.test.ts    # Contract unit tests
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Home / portfolio viewer
│   │   ├── mint/page.tsx        # Mint new credential
│   │   └── verify/[address]/    # Public verifier page
│   ├── components/
│   │   ├── ConnectButton.tsx    # RainbowKit wallet button
│   │   ├── CredentialCard.tsx   # NFT credential display
│   │   ├── MintForm.tsx         # Credential minting form
│   │   └── SkillBadge.tsx       # Skill tag component
│   ├── hooks/
│   │   ├── useCredentials.ts    # Read credentials from contract
│   │   └── useMintCredential.ts # Mint transaction hook
│   ├── lib/
│   │   ├── wagmi.ts             # wagmi + RainbowKit config
│   │   ├── contract.ts          # Contract ABI + address
│   │   └── ipfs.ts              # IPFS metadata helpers
│   └── types/
│       └── credential.ts        # TypeScript types
└── docs/
    └── preview.png
```

## 📄 Smart Contract

The `OnChainResume.sol` contract implements:

```solidity
// ERC-721 with custom credential metadata
struct Credential {
    string title;       // e.g. "Senior Frontend Engineer @ Tencent"
    string category;    // work | skill | education | certification
    string[] skills;    // ["TypeScript", "React", "Solidity"]
    uint256 startDate;  // unix timestamp
    uint256 endDate;    // 0 = current
    address issuer;     // self-issued or third-party
    bool endorsed;      // has third-party signature
}
```

Key functions:
- `mintCredential(...)` — mint a new credential NFT
- `endorseCredential(tokenId)` — co-sign a credential
- `getCredentialsByAddress(owner)` — fetch all credentials for a wallet
- `verifyCredential(tokenId)` — on-chain verification

## 🔍 Live Demo

- **App**: [https://on-chain-resume.vercel.app](https://on-chain-resume.vercel.app) *(deploying)*
- **Contract on Sepolia**: `0x...` *(pending deployment)*
- **My Credentials**: [View on OpenSea Testnet](https://testnets.opensea.io) *(after deployment)*

## 🧪 Running Tests

```bash
npm run compile
npm test
```

Sample output:
```
  OnChainResume Contract
    Deployment
      ✓ Should deploy with correct name and symbol
      ✓ Should set owner correctly
    Minting
      ✓ Should mint a credential NFT with correct metadata
      ✓ Should increment token ID on each mint
      ✓ Should emit CredentialMinted event
    Endorsement
      ✓ Should allow third party to endorse a credential
      ✓ Should not allow double endorsement
    Access Control
      ✓ Should restrict admin functions to owner

  8 passing (1.2s)
```

## 🗺️ Roadmap

- [x] ERC-721 credential contract
- [x] Next.js frontend with wagmi v2
- [x] Wallet connection (MetaMask + WalletConnect)
- [x] Mint credential form
- [x] Public verifier page (`/verify/0x...`)
- [ ] IPFS metadata upload integration
- [ ] Endorsement UI
- [ ] ENS name resolution
- [ ] Soulbound Token (SBT / ERC-5192) variant
- [ ] ZK proof of credential ownership (zk-SNARKs)
- [ ] Multi-sig issuer verification

## 📜 License

MIT © [Cao150702](https://github.com/Cao150702)
