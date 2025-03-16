import { createSlice } from "@reduxjs/toolkit";

interface PortfolioState {
  btcBalance: number; // e.g., how many BTC the user holds
  // Possibly track unrealized P/L in another field
}

const initialState: PortfolioState = {
  btcBalance: 0.0002,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    buyBitcoin: (state, action) => {
      // e.g., action.payload = { amountInEUR: number; currentPrice: number }
      const { amountInEUR, currentPrice } = action.payload;
      // Convert EUR to BTC
      const btcBought = amountInEUR / currentPrice;
      state.btcBalance += btcBought;
    },
    sellBitcoin: (state, action) => {
      // e.g., action.payload = { amountInBTC: number; currentPrice: number }
      const { amountInBTC } = action.payload;
      state.btcBalance -= amountInBTC;
    },
  },
});

export const { buyBitcoin, sellBitcoin } = portfolioSlice.actions;
export default portfolioSlice.reducer;
