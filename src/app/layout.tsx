import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Providers } from "@/components/Web3Providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OnChainResume — Verifiable Credentials on the Blockchain",
  description:
    "Mint your work experience, skills, and certifications as NFTs. Share a wallet address. Let anyone trustlessly verify your professional identity.",
  keywords: ["Web3", "NFT", "resume", "credentials", "blockchain", "DApp", "Ethereum"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
