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