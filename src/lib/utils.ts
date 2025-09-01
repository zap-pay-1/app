import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function truncateMiddle(
  str: string,
  frontChars = 5,
  backChars = 3,
  maxLength = 10,
): string {
  if (!str || str.length <= maxLength) return str;
  const start = str.slice(0, frontChars);
  const end = str.slice(-backChars);
  return `${start}...${end}`;
}
export function truncateEnd(text : string, maxLength = 25) {
  if (!text) return ""; // handle null/undefined
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - 1) + "...";
}


const STACKS_EXPLORER_URL = "https://explorer.hiro.so";

export function openInExplorer(txId: string, network: "mainnet" | "testnet" = "testnet") {
  const url = `${STACKS_EXPLORER_URL}/txid/${txId}?chain=${network}`;
  window.open(url, "_blank"); // opens in a new tab
}