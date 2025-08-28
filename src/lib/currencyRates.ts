// utils/prices.ts
import axios from "axios";

type SimplePriceResp = { bitcoin: { usd: number } };

const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price";
const CACHE_MS = 60_000;

let cachedPrice: number | null = null;
let cachedAt = 0;

function buildCoinGeckoHeaders() {
  const headers: Record<string, string> = { Accept: "application/json" };

  // Use whichever key you have set. Some accounts use demo; Pro uses pro header.
  if (process.env.COINGECKO_API_KEY) {
    headers["x-cg-pro-api-key"] = process.env.COINGECKO_API_KEY;
  }
  if (process.env.COINGECKO_DEMO_API_KEY) {
    headers["x-cg-demo-api-key"] = process.env.COINGECKO_DEMO_API_KEY!;
  }
  // If CoinGecko provided you a different header name, add it here as well:
  if (process.env.COINGECKO_GENERIC_API_KEY) {
    headers["x-cg-api-key"] = process.env.COINGECKO_GENERIC_API_KEY!;
  }

  return headers;
}

/** Convenience helpers */
export function btcToSats(btc: number): number {
  return Math.round(btc * 1e8);
}
export function satsToBtc(sats: number): number {
  return sats / 1e8;
}

export function formatBTC(btcAmount: number) {
  if (btcAmount >= 0.01) {
    return `${btcAmount.toFixed(8)} BTC`;
  } else {
    const sats = Math.round(btcAmount * 1e8);
    return `${sats} sats`;
  }
}

/** Convert sats → BTC and format nicely */
/** Convert sats → BTC and format nicely for UI */
export function formatSatsToBtcUI(sats: number): string {
  const btc = sats / 1e8;

  if (btc === 0) return '0 BTC';

  // Convert to string with up to 8 decimals, remove trailing zeros
  const formatted = btc.toFixed(8).replace(/\.?0+$/, '');

  return `${formatted} sBTC`;
}

export function formatSatsToBtcUI1(sats: number): string {
  const btc = sats / 1e8;

  if (btc === 0) return '0 BTC';

  if (btc >= 0.0001) {
    // Show BTC with up to 6 decimals
    return `${btc.toFixed(6).replace(/\.?0+$/, '')} sBTC`;
  } else {
    // Show sats for very tiny amounts
    return `${sats} sats`;
  }
}

/** Get current BTC price in USD (cached for 60s) */
export async function getBtcUsdPrice(forceRefresh = false): Promise<number> {
  const now = Date.now();
  if (!forceRefresh && cachedPrice && now - cachedAt < CACHE_MS) {
    return cachedPrice;
  }

  const { data } = await axios.get<SimplePriceResp>(COINGECKO_URL, {
    params: { ids: "bitcoin", vs_currencies: "usd" },
    //headers: buildCoinGeckoHeaders(),
      headers: {
        accept: "application/json",
        "x-cg-api-key": "CG-TtQgZX9c9RkAnBQLmcwJhzLd", // ✅ Pass key directly
      },
  });

  const price = data?.bitcoin?.usd;
  if (!price || Number.isNaN(price)) {
    throw new Error("Failed to parse BTC price from CoinGecko");
  }

  cachedPrice = price;
  cachedAt = now;
  console.log(`cached at ${cachedAt}  price : ${price}`)
  return price;
}

/** Convert USD → BTC using the current price */
export async function usdToBtc(usdAmount: number): Promise<number> {
  if (usdAmount < 0) throw new Error("Amount must be >= 0");
  const price = await getBtcUsdPrice();
  const btc = usdAmount / price
   const sats = btcToSats(btc)
   const formatted = formatBTC(btc)
  console.log(`Btc Amount ${btc}`)
console.log(`Sats Amount ${sats}`)
console.log(`Formatted ${formatted}`)


  return btc   //usdAmount / price; // BTC
}

/** Convert USD → sats (rounded) */
export async function usdToSats(usdAmount: number): Promise<number> {
  const btc = await usdToBtc(usdAmount);
  return Math.round(btc * 1e8);
}


/** Convert sats → USD using current BTC price */
export async function satsToUsd(sats: number): Promise<number> {
  const btc = satsToBtc(sats);       // Convert sats → BTC
  const price = await getBtcUsdPrice();
  return btc * price;                // BTC → USD
}

