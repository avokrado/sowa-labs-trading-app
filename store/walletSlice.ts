import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  btcBalance: number;
  eurBalance: number;
}

const initialState: WalletState = {
  btcBalance: 0,
  eurBalance: 100,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateBalance: (
      state: WalletState,
      action: PayloadAction<{ btcBalance: number; eurBalance: number }>
    ) => {
      const { btcBalance, eurBalance } = action.payload;
      state.btcBalance = btcBalance;
      state.eurBalance = eurBalance;
    },
  },
});

export const { updateBalance } = walletSlice.actions;
export default walletSlice.reducer;
