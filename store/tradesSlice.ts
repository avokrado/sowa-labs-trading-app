import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { btcToSats } from "@/utils/convertSatoshis";
import { updateWalletBalance } from "./walletSlice";
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
      // This will run before the reducer. We will use it to prepare the payload: inject id and timestamp
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
In our case we just update the state, so usage of thunk is just for demonstration purposes. It could be implemented with regular reducers
*/
export const executeBuyTrade = createAsyncThunk(
  "trades/executeBuy",
  async (
    params: { amountInBTC: number; amountInEUR: number; price: number },
    { dispatch, getState, rejectWithValue }
  ) => {
    const { amountInEUR, amountInBTC, price } = params;

    const state = getState() as RootState;
    const { btcBalanceInSats, eurBalance } = state.wallet;
    // Validate user has enough EUR
    if (amountInEUR > eurBalance) {
      return rejectWithValue("Insufficient EUR balance");
    }

    // Convert the user’s BTC decimal to integer satoshis
    const satsToBuy = btcToSats(amountInBTC);

    // Calculate new wallet totals, in integer satoshis for BTC
    const newBtcBalanceInSats = btcBalanceInSats + satsToBuy;
    const newEurBalance = eurBalance - amountInEUR;

    // 4) Dispatch the trade + update the wallet
    dispatch(addTrade("BUY", amountInBTC, amountInEUR, price));
    dispatch(
      updateWalletBalance({
        btcBalanceInSats: newBtcBalanceInSats,
        eurBalance: newEurBalance,
      })
    );
  }
);

// Sell thunk
export const executeSellTrade = createAsyncThunk(
  "trades/executeSell",
  async (
    {
      amountInBTC,
      amountInEUR,
      price,
    }: { amountInBTC: number; amountInEUR: number; price: number },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState() as any;
    const { btcBalanceInSats, eurBalance } = state.wallet;

    // 1) Convert user decimal to satoshis
    const satsToSell = btcToSats(amountInBTC);

    // 2) Validate we have enough satoshis
    if (satsToSell > btcBalanceInSats) {
      return rejectWithValue("Insufficient BTC balance");
    }

    // 3) Compute new balances
    const newBtcBalanceInSats = btcBalanceInSats - satsToSell;
    const newEurBalance = eurBalance + amountInEUR;

    // 4) Dispatch the trade + update the wallet
    dispatch(addTrade("SELL", amountInBTC, amountInEUR, price));
    dispatch(
      updateWalletBalance({
        btcBalanceInSats: newBtcBalanceInSats,
        eurBalance: newEurBalance,
      })
    );
  }
);

export default tradesSlice.reducer;
