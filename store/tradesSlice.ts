import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { updateBalance } from "./walletSlice";
import { RootState } from "./index";

export interface Trade {
  id: string;
  type: "BUY" | "SELL";
  amountInBTC: number;
  amountInEUR: number;
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
      prepare(
        type: "BUY" | "SELL",
        btcAmount: number,
        eurAmount: number,
        price: number
      ) {
        return {
          payload: {
            id: nanoid(),
            type,
            amountInBTC: btcAmount,
            amountInEUR: eurAmount,
            price,
            timestamp: Date.now(),
          },
        };
      },
    },
  },
});

export const { addTrade } = tradesSlice.actions;

/**
 * BUY thunk
 */
export const executeBuyTrade = createAsyncThunk(
  "trades/executeBuy",
  async (
    params: { amountInBTC: number; amountInEUR: number; price: number },
    { dispatch, getState, rejectWithValue }
  ) => {
    if (!params.amountInBTC || !params.amountInEUR) {
      return rejectWithValue("Invalid amount");
    }

    const state = getState() as RootState;
    const { btcBalance, eurBalance } = state.wallet;

    // Validate EUR balance first
    if (params.amountInEUR > eurBalance) {
      return rejectWithValue("Insufficient EUR balance");
    }

    // After rounding with toFixed(8):
    let newBtcBalance = parseFloat(
      (btcBalance + params.amountInBTC).toFixed(8)
    );

    // If it's so tiny that it's below 1 satoshi, force to zero:
    if (Math.abs(newBtcBalance) < 1e-8) {
      newBtcBalance = 0;
    }

    const newEurBalance = parseFloat(
      (eurBalance - params.amountInEUR).toFixed(2)
    );

    // Dispatch trade + updated balances
    dispatch(
      addTrade("BUY", params.amountInBTC, params.amountInEUR, params.price)
    );
    dispatch(
      updateBalance({ btcBalance: newBtcBalance, eurBalance: newEurBalance })
    );
  }
);

/**
 * SELL thunk
 */
export const executeSellTrade = createAsyncThunk(
  "trades/executeSell",
  async (
    params: { amountInBTC: number; amountInEUR: number; price: number },
    { dispatch, getState, rejectWithValue }
  ) => {
    if (!params.amountInBTC || !params.amountInEUR) {
      return rejectWithValue("Invalid amount");
    }
    const state = getState() as RootState;
    const { btcBalance, eurBalance } = state.wallet;

    // Validate BTC balance
    if (params.amountInBTC > btcBalance) {
      return rejectWithValue("Insufficient BTC balance");
    }

    // Calculate and round
    const newBtcBalance = parseFloat(
      (btcBalance - params.amountInBTC).toFixed(8)
    );
    const newEurBalance = parseFloat(
      (eurBalance + params.amountInEUR).toFixed(2)
    );

    // Dispatch trade + updated balances
    dispatch(
      addTrade("SELL", params.amountInBTC, params.amountInEUR, params.price)
    );
    dispatch(
      updateBalance({ btcBalance: newBtcBalance, eurBalance: newEurBalance })
    );
  }
);

export default tradesSlice.reducer;
