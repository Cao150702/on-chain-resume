export type CredentialCategory = "WORK" | "SKILL" | "EDUCATION" | "PROJECT" | "AWARD";

export const CREDENTIAL_CATEGORY_LABELS: Record<CredentialCategory, string> = {
  WORK: "Work Experience",
  SKILL: "Skill / Certification",
  EDUCATION: "Education",
  PROJECT: "Project",
  AWARD: "Award / Recognition",
};

export const CREDENTIAL_CATEGORY_COLORS: Record<CredentialCategory, string> = {
  WORK: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  SKILL: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  EDUCATION: "bg-green-500/20 text-green-300 border-green-500/30",
  PROJECT: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  AWARD: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export const CREDENTIAL_CATEGORY_ENUM: Record<CredentialCategory, number> = {
  WORK: 0,
  SKILL: 1,
  EDUCATION: 2,
  PROJECT: 3,
  AWARD: 4,
};

export interface CredentialOnChain {
  title: string;
  organization: string;
  description: string;
  skills: string[];
  category: number;
  startDate: bigint;
  endDate: bigint;
  issuer: `0x${string}`;
  endorsed: boolean;
  endorsementCount: bigint;
}

export interface CredentialDisplay extends CredentialOnChain {
  tokenId: number;
  tokenURI: string;
  owner: `0x${string}`;
}

export interface MintFormData {
  title: string;
  organization: string;
  description: string;
  skills: string;
  category: CredentialCategory;
  startDate: string;
  endDate: string;
}
