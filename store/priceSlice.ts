import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChartData {
  timestamp: number;
  price: number;
}
interface PriceState {
  currentPrice: number;
  chartData: ChartData[];
  error: string | null;
}

const initialState: PriceState = {
  currentPrice: 0,
  chartData: [],
  error: null,
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
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { updateChartData, updatePrice, setError } = priceSlice.actions;
export default priceSlice.reducer;
