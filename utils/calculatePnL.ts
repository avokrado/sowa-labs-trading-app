import { Trade } from "@/store/tradesSlice";

export interface PnLData {
  realizedPnL: number; // Profit/loss from completed trades
  unrealizedPnL: number; // Potential profit/loss from current holdings
  totalPnL: number; // Sum of realized and unrealized PnL
}

export const calculatePnL = (
  trades: Trade[], // Array of past trades
  currentBtcBalance: number, // Current BTC holdings
  currentPrice: number // Current BTC price
): PnLData => {
  let realizedPnL = 0; // Running total of completed trade profits/losses
  let investedAmount = 0; // Total amount spent on BTC purchases
  let totalBtcBought = 0; // Total BTC amount from purchases
  let averageEntryPrice = 0; // Average price paid per BTC

  // Calculate realized PnL and average entry price
  trades.forEach((trade) => {
    if (trade.type === "BUY") {
      // For buy trades:
      const cost = trade.amountInBTC * trade.price; // Calculate total cost
      investedAmount += cost; // Add to total invested
      totalBtcBought += trade.amountInBTC; // Add to total BTC bought
      averageEntryPrice = investedAmount / totalBtcBought; // Update average price
    } else {
      // For sell trades:
      const revenue = trade.amountInBTC * trade.price; // Calculate sale revenue
      const costBasis = trade.amountInBTC * averageEntryPrice; // Calculate original cost
      realizedPnL += revenue - costBasis; // Add profit/loss to realized total
    }
  });

  // Calculate unrealized PnL based on current holdings and price difference
  const unrealizedPnL = currentBtcBalance * (currentPrice - averageEntryPrice);

  return {
    realizedPnL, // Profit/loss from completed trades
    unrealizedPnL, // Potential profit/loss from current holdings
    totalPnL: realizedPnL + unrealizedPnL, // Total combined PnL
  };
};
