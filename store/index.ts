import { configureStore } from "@reduxjs/toolkit";
import priceReducer from "./priceSlice";
import walletReducer from "./walletSlice";
import tradesReducer from "./tradesSlice";
import modalReducer from "./modalSlice";
import { ThunkAction, Action } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    price: priceReducer,
    wallet: walletReducer,
    trades: tradesReducer,
    modal: modalReducer,
  },
});

// Types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
