import { expect } from "chai";
import { ethers } from "hardhat";
import { OnChainResume } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("OnChainResume Contract", () => {
  let contract: OnChainResume;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  const SAMPLE_TOKEN_URI = "ipfs://QmSampleHash123/metadata.json";
  const CATEGORY_WORK = 0; // CredentialCategory.WORK
  const CATEGORY_SKILL = 1;

  async function mintSampleCredential(signer: HardhatEthersSigner, title = "Software Engineer") {
    const start = await time.latest();
    return contract.connect(signer).mintCredential(
      title,
      "Acme Corp",
      "Built full-stack dApps using Next.js and Solidity",
      ["TypeScript", "React", "Solidity", "ethers.js"],
      CATEGORY_WORK,
      start,
      0, // ongoing
      SAMPLE_TOKEN_URI
    );
  }

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("OnChainResume");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  // ─────────────────────────────────────────────
  // Deployment
  // ─────────────────────────────────────────────

  describe("Deployment", () => {
    it("should deploy with correct name and symbol", async () => {
      expect(await contract.name()).to.equal("OnChainResume");
      expect(await contract.symbol()).to.equal("OCR");
    });

    it("should set deployer as owner", async () => {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should start with zero minted credentials", async () => {
      expect(await contract.totalMinted()).to.equal(0);
    });
  });

  // ─────────────────────────────────────────────
  // Minting
  // ─────────────────────────────────────────────

  describe("Minting", () => {
    it("should mint a credential NFT and store metadata", async () => {
      const start = await time.latest();
      await contract.connect(alice).mintCredential(
        "Senior Frontend Engineer",
        "Tencent",
        "Led the migration to micro-frontend architecture",
        ["React", "TypeScript", "Webpack"],
        CATEGORY_WORK,
        start,
        0,
        SAMPLE_TOKEN_URI
      );

      const cred = await contract.getCredential(0);
      expect(cred.title).to.equal("Senior Frontend Engineer");
      expect(cred.organization).to.equal("Tencent");
      expect(cred.issuer).to.equal(alice.address);
      expect(cred.endorsed).to.be.false;
      expect(cred.endorsementCount).to.equal(0);
    });

    it("should assign token to the minting address", async () => {
      await mintSampleCredential(alice);
      expect(await contract.ownerOf(0)).to.equal(alice.address);
    });

    it("should increment token ID on each mint", async () => {
      await mintSampleCredential(alice);
      await mintSampleCredential(alice, "Smart Contract Auditor");
      expect(await contract.totalMinted()).to.equal(2);
      expect(await contract.ownerOf(1)).to.equal(alice.address);
    });

    it("should emit CredentialMinted event", async () => {
      const start = await time.latest();
      await expect(
        contract.connect(alice).mintCredential(
          "DeFi Developer",
          "Self",
          "Built a Uniswap V3 liquidity manager",
          ["Solidity", "DeFi"],
          CATEGORY_SKILL,
          start,
          0,
          SAMPLE_TOKEN_URI
        )
      )
        .to.emit(contract, "CredentialMinted")
        .withArgs(0, alice.address, CATEGORY_SKILL, "DeFi Developer");
    });

    it("should track credentials by owner address", async () => {
      await mintSampleCredential(alice);
      await mintSampleCredential(alice, "Web3 Lead");
      const ids = await contract.getCredentialsByOwner(alice.address);
      expect(ids.length).to.equal(2);
      expect(ids[0]).to.equal(0);
      expect(ids[1]).to.equal(1);
    });

    it("should revert if title is empty", async () => {
      const start = await time.latest();
      await expect(
        contract.connect(alice).mintCredential(
          "", "Org", "Desc", [], CATEGORY_WORK, start, 0, SAMPLE_TOKEN_URI
        )
      ).to.be.revertedWith("OCR: title required");
    });

    it("should revert if end date is before start date", async () => {
      const start = await time.latest();
      await expect(
        contract.connect(alice).mintCredential(
          "Role", "Org", "Desc", [], CATEGORY_WORK, start, start - 1, SAMPLE_TOKEN_URI
        )
      ).to.be.revertedWith("OCR: invalid date range");
    });
  });

  // ─────────────────────────────────────────────
  // Endorsement
  // ─────────────────────────────────────────────

  describe("Endorsement", () => {
    beforeEach(async () => {
      await mintSampleCredential(alice);
    });

    it("should allow a third party to endorse a credential", async () => {
      await contract.connect(bob).endorseCredential(0);
      const cred = await contract.getCredential(0);
      expect(cred.endorsed).to.be.true;
      expect(cred.endorsementCount).to.equal(1);
    });

    it("should emit CredentialEndorsed event", async () => {
      await expect(contract.connect(bob).endorseCredential(0))
        .to.emit(contract, "CredentialEndorsed")
        .withArgs(0, bob.address, 1);
    });

    it("should reject self-endorsement", async () => {
      await expect(
        contract.connect(alice).endorseCredential(0)
      ).to.be.revertedWith("OCR: cannot self-endorse");
    });

    it("should reject double endorsement from same address", async () => {
      await contract.connect(bob).endorseCredential(0);
      await expect(
        contract.connect(bob).endorseCredential(0)
      ).to.be.revertedWith("OCR: already endorsed");
    });

    it("should track which addresses endorsed which credential", async () => {
      await contract.connect(bob).endorseCredential(0);
      expect(await contract.hasEndorsed(0, bob.address)).to.be.true;
      expect(await contract.hasEndorsed(0, owner.address)).to.be.false;
    });
  });
});
