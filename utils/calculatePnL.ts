import { Trade } from "@/store/tradesSlice";

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
 * @param currentBtcBalance - Current BTC holdings
 * @param currentPrice - Current BTC price in EUR
 * @returns PnLData containing realized, unrealized and total PnL
 */
export const calculatePnL = (
  trades: Trade[],
  currentBtcBalance: number,
  currentPrice: number
): PnLData => {
  // Initialize tracking variables
  let realizedPnL = 0; // Tracks completed trade profits/losses
  let totalCost = 0; // Total EUR cost of all BTC purchases
  let totalBtcTraded = 0; // Running total of BTC bought/sold
  let averageEntryPrice = 0; // Weighted average purchase price in EUR

  // Process each trade chronologically to calculate realized PnL
  trades.forEach((trade) => {
    // Calculate total EUR value of this trade
    const tradeValue = trade.amountInBTC * trade.price;

    if (trade.type === "BUY") {
      // For buys:
      // 1. Add to total cost in EUR
      totalCost += tradeValue;
      // 2. Add to total BTC position
      totalBtcTraded += trade.amountInBTC;
      // 3. Update weighted average entry price
      averageEntryPrice = totalBtcTraded > 0 ? totalCost / totalBtcTraded : 0;
    } else {
      // For sells:
      // 1. Calculate profit/loss based on average entry price
      const costBasis = trade.amountInBTC * averageEntryPrice;
      realizedPnL += tradeValue - costBasis;

      // 2. Reduce the BTC position
      totalBtcTraded -= trade.amountInBTC;
      // 3. Reduce the total cost proportionally to maintain accurate average
      totalCost = totalBtcTraded * averageEntryPrice;
    }
  });

  // Calculate unrealized PnL based on:
  // 1. Current BTC holdings
  // 2. Difference between current price and average entry price
  const unrealizedPnL = currentBtcBalance * (currentPrice - averageEntryPrice);

  // Return all PnL components
  return {
    realizedPnL,
    unrealizedPnL,
    totalPnL: realizedPnL + unrealizedPnL,
  };
};
