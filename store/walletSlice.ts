import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SATS_PER_BTC } from "@/constants/satoshi";

interface WalletState {
  btcBalanceInSats: number; // store BTC as integer satoshis
  eurBalance: number;
}

const initialState: WalletState = {
  btcBalanceInSats: 0,
  eurBalance: 100, // 100 EUR start balance
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // Update BTC and EUR balances
    updateWalletBalance: (
      state,
      action: PayloadAction<{
        btcBalanceInSats: number;
        eurBalance: number;
      }>
    ) => {
      const { btcBalanceInSats, eurBalance } = action.payload;
      state.btcBalanceInSats = btcBalanceInSats;
      state.eurBalance = eurBalance;
    },
  },
});

export const { updateWalletBalance } = walletSlice.actions;
export default walletSlice.reducer;
