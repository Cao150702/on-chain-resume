"use client";

import { BadgeCheck, Calendar, Briefcase, Award, Code2, GraduationCap, FolderGit2, ThumbsUp } from "lucide-react";
import type { CredentialDisplay } from "@/types/credential";
import {
  CREDENTIAL_CATEGORY_LABELS,
  CREDENTIAL_CATEGORY_COLORS,
} from "@/types/credential";
import { SkillBadge } from "./SkillBadge";
import clsx from "clsx";

const CATEGORY_ICONS: Record<number, React.ComponentType<{ size?: number; className?: string }>> = {
  0: Briefcase,
  1: Code2,
  2: GraduationCap,
  3: FolderGit2,
  4: Award,
};

const CATEGORY_NAMES: Record<number, string> = {
  0: "WORK",
  1: "SKILL",
  2: "EDUCATION",
  3: "PROJECT",
  4: "AWARD",
};

function formatDate(ts: bigint): string {
  if (ts === 0n) return "Present";
  return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

interface CredentialCardProps {
  credential: CredentialDisplay;
  onEndorse?: (tokenId: number) => void;
  canEndorse?: boolean;
}

export function CredentialCard({ credential, onEndorse, canEndorse }: CredentialCardProps) {
  const categoryKey = CATEGORY_NAMES[credential.category] as keyof typeof CREDENTIAL_CATEGORY_LABELS;
  const categoryLabel = CREDENTIAL_CATEGORY_LABELS[categoryKey] ?? "Unknown";
  const categoryColor = CREDENTIAL_CATEGORY_COLORS[categoryKey] ?? "";
  const Icon = CATEGORY_ICONS[credential.category] ?? Briefcase;

  return (
    <div className="group relative rounded-xl border border-web3-border bg-web3-card
                    hover:border-web3-purple/50 transition-all duration-300
                    hover:shadow-lg hover:shadow-purple-500/5 p-5">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-web3-purple/10 text-web3-purple mt-0.5">
            <Icon size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-white leading-tight">{credential.title}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{credential.organization}</p>
          </div>
        </div>
        <span className={clsx("text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap", categoryColor)}>
          {categoryLabel}
        </span>
      </div>

      {/* Description */}
      {credential.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{credential.description}</p>
      )}

      {/* Skills */}
      {credential.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {credential.skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-web3-border">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar size={12} />
          <span>{formatDate(credential.startDate)}</span>
          <span className="text-gray-600">—</span>
          <span>{formatDate(credential.endDate)}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Endorsement count */}
          {credential.endorsed && (
            <div className="flex items-center gap-1 text-xs text-green-400">
              <BadgeCheck size={13} />
              <span>{Number(credential.endorsementCount)} endorsed</span>
            </div>
          )}

          {/* Endorse button */}
          {canEndorse && (
            <button
              onClick={() => onEndorse?.(credential.tokenId)}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md
                         border border-web3-border text-gray-400 hover:text-white
                         hover:border-web3-purple transition-all duration-200"
            >
              <ThumbsUp size={11} />
              Endorse
            </button>
          )}

          {/* Token ID badge */}
          <span className="font-mono text-xs text-gray-600">#{credential.tokenId}</span>
        </div>
      </div>
    </div>
  );
}
