import { SATS_PER_BTC } from "@/constants/satoshi";

/**
 * Converts Bitcoin (BTC) amount to Satoshis
 * 1 BTC = 100,000,000 Satoshis
 *
 * @param btc - Amount in Bitcoin as a decimal number
 * @returns Number of Satoshis as an integer
 */
export function btcToSats(btc: number): number {
  // Use Math.round so we avoid floating point rounding errors
  return Math.round(btc * SATS_PER_BTC);
}

/**
 * Converts Satoshis to Bitcoin (BTC) amount
 * 1 Satoshi = 0.00000001 BTC
 *
 * @param sats - Number of Satoshis as an integer
 * @returns Amount in Bitcoin as a decimal number
 */
export function satsToBtc(sats: number): number {
  return sats / SATS_PER_BTC;
}
