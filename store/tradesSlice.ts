import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export interface Trade {
  id: string;
  type: "BUY" | "SELL";
  amountInBTC: number;
  price: number; // price at time of trade
  timestamp: number;
}

interface TradesState {
  trades: Trade[];
}

const initialState: TradesState = {
  trades: [],
};

const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {
    addTrade: {
      reducer(state, action: PayloadAction<Trade>) {
        state.trades.unshift(action.payload);
      },
      prepare(type: "BUY" | "SELL", amountInBTC: number, price: number) {
        return {
          payload: {
            id: nanoid(),
            type,
            amountInBTC,
            price,
            timestamp: Date.now(),
          },
        };
      },
    },
  },
});

export const { addTrade } = tradesSlice.actions;
export default tradesSlice.reducer;
