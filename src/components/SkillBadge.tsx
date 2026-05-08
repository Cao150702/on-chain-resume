"use client";

interface SkillBadgeProps {
  skill: string;
}

const SKILL_COLORS: Record<string, string> = {
  Solidity: "bg-gray-500/20 text-gray-300",
  TypeScript: "bg-blue-500/20 text-blue-300",
  JavaScript: "bg-yellow-500/20 text-yellow-300",
  React: "bg-cyan-500/20 text-cyan-300",
  "Next.js": "bg-white/10 text-white",
  Python: "bg-green-500/20 text-green-300",
  Rust: "bg-orange-500/20 text-orange-300",
  Go: "bg-sky-500/20 text-sky-300",
  "ethers.js": "bg-purple-500/20 text-purple-300",
  wagmi: "bg-violet-500/20 text-violet-300",
  viem: "bg-indigo-500/20 text-indigo-300",
  DeFi: "bg-emerald-500/20 text-emerald-300",
  NFT: "bg-pink-500/20 text-pink-300",
  Hardhat: "bg-yellow-600/20 text-yellow-400",
};

const DEFAULT_COLOR = "bg-web3-border text-gray-400";

export function SkillBadge({ skill }: SkillBadgeProps) {
  const colorClass = SKILL_COLORS[skill] ?? DEFAULT_COLOR;

  return (
    <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${colorClass}`}>
      {skill}
    </span>
  );
}
