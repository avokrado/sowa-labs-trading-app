import { configureStore } from "@reduxjs/toolkit";
import priceReducer from "./priceSlice";
import portfolioReducer from "./portfolioSlice";
import tradesReducer from "./tradesSlice";

export const store = configureStore({
  reducer: {
    price: priceReducer,
    portfolio: portfolioReducer,
    trades: tradesReducer,
  },
});

// Types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
