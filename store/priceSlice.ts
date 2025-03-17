import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChartData {
  timestamp: number;
  price: number;
}
interface PriceState {
  currentPrice: number;
  chartData: ChartData[]; // or {x: number, y: number}[] if you prefer
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  wsStatus: "connected" | "disconnected" | "connecting";
}

const initialState: PriceState = {
  currentPrice: 0,
  chartData: [],
  status: "idle",
  error: null,
  wsStatus: "disconnected",
};

const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    updateChartData: (state, action: PayloadAction<number[][]>) => {
      state.chartData = action.payload.map(([timestamp, price]) => ({
        timestamp,
        price,
      }));
    },
    updatePrice: (state, action: PayloadAction<number>) => {
      state.currentPrice = action.payload;
      state.status = "succeeded";
    },
    setWsStatus: (state, action: PayloadAction<PriceState["wsStatus"]>) => {
      state.wsStatus = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { updateChartData, updatePrice, setWsStatus, setError } =
  priceSlice.actions;
export default priceSlice.reducer;
