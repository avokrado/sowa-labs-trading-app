import { SATS_PER_BTC } from "@/constants/satoshi";
import { Trade } from "@/store/tradesSlice";
import { satsToBtc } from "@/utils/convertSatoshis";

/**
 * Interface representing Profit and Loss (PnL) data
 */
export interface PnLData {
  /**
   * Profit/loss from completed trades (sells)
   * Calculated as: sell value - cost basis of sold BTC
   */
  realizedPnL: number;

  /**
   * Potential profit/loss from current BTC holdings
   * Calculated as: current holdings * (current price - average entry price)
   */
  unrealizedPnL: number;

  /**
   * Total combined PnL (realized + unrealized)
   */
  totalPnL: number;
}

/**
 * Calculates realized and unrealized profit/loss from BTC trades
 *
 * @param trades - Array of buy/sell trades ordered chronologically
 * @param currentBtcBalanceInSats - Current BTC holdings in satoshis
 * @param currentPrice - Current BTC price in EUR
 * @returns PnLData containing realized, unrealized and total PnL
 */
export const calculatePnL = (
  trades: Trade[],
  currentBtcBalanceInSats: number,
  currentPrice: number
): PnLData => {
  // Initialize tracking variables
  let realizedPnL = 0; // Tracks completed trade profits/losses
  let totalCost = 0; // Total EUR cost of all BTC purchases
  let totalBtcInSats = 0; // Running total of BTC bought/sold in satoshis
  let averageEntryPrice = 0; // Weighted average purchase price in EUR

  // Process each trade chronologically to calculate realized PnL
  trades.forEach((trade) => {
    // Calculate total EUR value of this trade
    const tradeValue = trade.amountInBTC * trade.price;
    const tradeAmountInSats = Math.round(trade.amountInBTC * SATS_PER_BTC);

    if (trade.type === "BUY") {
      // For buys:
      // 1. Add to total cost in EUR
      totalCost += tradeValue;
      // 2. Add to total BTC position (in satoshis)
      totalBtcInSats += tradeAmountInSats;
      // 3. Update weighted average entry price
      averageEntryPrice =
        totalBtcInSats > 0 ? totalCost / satsToBtc(totalBtcInSats) : 0;
    } else {
      // For sells:
      // 1. Calculate profit/loss based on average entry price
      const costBasis = satsToBtc(tradeAmountInSats) * averageEntryPrice;
      realizedPnL += tradeValue - costBasis;

      // 2. Reduce the BTC position
      totalBtcInSats -= tradeAmountInSats;
      // 3. Reduce the total cost proportionally to maintain accurate average
      totalCost = satsToBtc(totalBtcInSats) * averageEntryPrice;
    }
  });

  // Calculate unrealized PnL based on:
  // 1. Current BTC holdings (convert satoshis to BTC)
  // 2. Difference between current price and average entry price
  const unrealizedPnL =
    satsToBtc(currentBtcBalanceInSats) * (currentPrice - averageEntryPrice);

  // Return all PnL components
  return {
    realizedPnL,
    unrealizedPnL,
    totalPnL: realizedPnL + unrealizedPnL,
  };
};
