# 链上简历 🔗

> **去中心化作品集 & 凭证 NFT dApp** — 将技能和工作经历铸造为可在链上验证的 NFT，HR 或招聘方可随时无需信任地核查。

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue?logo=solidity)](https://soliditylang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

![on-chain-resume-preview](docs/preview.png)

## ✨ 功能特性

- **铸造凭证 NFT** — 将技能、证书和工作经历编码为带链上元数据的 ERC-721 代币
- **防篡改** — 一旦铸造，凭证不可更改，任何人均可验证
- **钱包即身份** — 连接 MetaMask / WalletConnect，你的地址就是你的身份
- **链上核查** — 招聘方扫描钱包地址，即可查看所有已颁发凭证
- **背书系统** — 前同事、合作伙伴可在链上为你的凭证签名背书
- **IPFS 元数据** — 丰富的 JSON 元数据通过 Pinata/NFT.Storage 存储于 IPFS
- **多链支持** — 已部署于 Sepolia 测试网，Polygon Amoy 配置已内置

## 🛠️ 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | Next.js 14（App Router）、TypeScript、Tailwind CSS |
| Web3 客户端 | wagmi v2、viem、RainbowKit |
| 智能合约 | Solidity 0.8.24、OpenZeppelin ERC-721 |
| 开发环境 | Hardhat、TypeChain |
| 元数据存储 | IPFS（via NFT.Storage） |
| 部署 | Vercel（前端）、Sepolia 测试网 |

## 🚀 快速开始

### 前置条件

- Node.js 18+
- MetaMask 浏览器扩展
- Sepolia 测试网 ETH（从 [水龙头](https://sepoliafaucet.com) 获取）

### 安装

```bash
git clone https://github.com/Cao150702/on-chain-resume.git
cd on-chain-resume
npm install
```

### 环境变量配置

```bash
cp .env.example .env.local
# 填入你自己的密钥
```

| 变量 | 说明 |
|---|---|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | [WalletConnect Cloud](https://cloud.walletconnect.com) 项目 ID |
| `NEXT_PUBLIC_CONTRACT_ADDRESS_SEPOLIA` | Sepolia 上已部署的合约地址 |
| `PRIVATE_KEY` | 部署者钱包私钥（切勿提交！） |
| `SEPOLIA_RPC_URL` | Alchemy / Infura Sepolia 节点地址 |
| `ETHERSCAN_API_KEY` | 用于合约验证 |

### 本地运行（连接本地 Hardhat 节点）

```bash
# 终端 1 — 启动本地区块链
npm run node

# 终端 2 — 将合约部署到本地节点
npm run deploy:local

# 终端 3 — 启动前端
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

### 部署到测试网

```bash
npm run deploy:sepolia
```

## 📁 项目结构

```
on-chain-resume/
├── contracts/
│   └── OnChainResume.sol        # ERC-721 凭证 NFT 合约
├── scripts/
│   └── deploy.ts                # Hardhat 部署脚本
├── test/
│   └── OnChainResume.test.ts    # 合约单元测试
├── src/
│   ├── app/
│   │   ├── layout.tsx           # 根布局（含 Provider）
│   │   ├── page.tsx             # 首页 / 作品集查看
│   │   ├── mint/page.tsx        # 铸造新凭证
│   │   └── verify/[address]/    # 公开验证页
│   ├── components/
│   │   ├── ConnectButton.tsx    # RainbowKit 钱包连接按钮
│   │   ├── CredentialCard.tsx   # NFT 凭证展示卡片
│   │   ├── MintForm.tsx         # 凭证铸造表单
│   │   └── SkillBadge.tsx       # 技能标签组件
│   ├── hooks/
│   │   ├── useCredentials.ts    # 从合约读取凭证
│   │   └── useMintCredential.ts # 铸造交易 Hook
│   ├── lib/
│   │   ├── wagmi.ts             # wagmi + RainbowKit 配置
│   │   ├── contract.ts          # 合约 ABI + 地址
│   │   └── ipfs.ts              # IPFS 元数据工具函数
│   └── types/
│       └── credential.ts        # TypeScript 类型定义
└── docs/
    └── preview.png
```

## 📄 智能合约

`OnChainResume.sol` 合约实现以下结构：

```solidity
// ERC-721，含自定义凭证元数据
struct Credential {
    string title;       // 例："腾讯高级前端工程师"
    string category;    // work | skill | education | certification
    string[] skills;    // ["TypeScript", "React", "Solidity"]
    uint256 startDate;  // Unix 时间戳
    uint256 endDate;    // 0 = 至今
    address issuer;     // 自签或第三方颁发
    bool endorsed;      // 是否有第三方签名
}
```

核心函数：
- `mintCredential(...)` — 铸造新凭证 NFT
- `endorseCredential(tokenId)` — 为凭证联署背书
- `getCredentialsByAddress(owner)` — 获取某钱包的所有凭证
- `verifyCredential(tokenId)` — 链上验证凭证

## 🔍 在线演示

- **应用**：[https://on-chain-resume.vercel.app](https://on-chain-resume.vercel.app)（部署中）
- **Sepolia 合约**：`0x...`（待部署）
- **我的凭证**：[在 OpenSea 测试网查看](https://testnets.opensea.io)（部署后可见）

## 🧪 运行测试

```bash
npm run compile
npm test
```

示例输出：
```
  OnChainResume 合约
    部署
      ✓ 应使用正确的名称和符号部署
      ✓ 应正确设置 owner
    铸造
      ✓ 应铸造包含正确元数据的凭证 NFT
      ✓ 每次铸造后 token ID 应递增
      ✓ 应触发 CredentialMinted 事件
    背书
      ✓ 应允许第三方为凭证背书
      ✓ 不应允许重复背书
    访问控制
      ✓ 管理员函数应仅限 owner 调用

  8 个测试通过（1.2s）
```

## 🗺️ 路线图

- [x] ERC-721 凭证合约
- [x] Next.js 前端（wagmi v2）
- [x] 钱包连接（MetaMask + WalletConnect）
- [x] 凭证铸造表单
- [x] 公开验证页（`/verify/0x...`）
- [ ] IPFS 元数据上传集成
- [ ] 背书 UI
- [ ] ENS 名称解析
- [ ] 灵魂绑定代币（SBT / ERC-5192）版本
- [ ] 凭证所有权零知识证明（zk-SNARKs）
- [ ] 多签颁发者验证

## 📜 开源协议

MIT © [Cao150702](https://github.com/Cao150702)
