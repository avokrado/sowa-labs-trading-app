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
  tradeBTCprice: number;
}

const initialState: TradesState = {
  trades: [],
  tradeBTCprice: 0,
};

const tradesSlice = createSlice({
  name: "trades",
  initialState,
  reducers: {
    addTrade: {
      reducer(state, action: PayloadAction<Trade>) {
        state.trades.unshift(action.payload);
        state.tradeBTCprice = 0;
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
    setTradeBTCprice: (state, action: PayloadAction<number>) => {
      state.tradeBTCprice = action.payload;
    },
  },
});

export const { addTrade, setTradeBTCprice } = tradesSlice.actions;

/* 
Here we should call an API to execute the trade
In our case we just update the state, so thunk is just for demonstration purposes
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

    if (params.amountInBTC < 1e-8) {
      return rejectWithValue("Amount too small");
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

/* 
Here we should call an API to execute the trade
In our case we just update the state, so thunk is just for demonstration purposes
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
    if (params.amountInBTC < 1e-8) {
      return rejectWithValue("Amount too small");
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
