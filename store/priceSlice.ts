import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChartData {
  timestamp: number;
  price: number;
}
interface PriceState {
  currentPrice: number;
  historicalData: {
    chartData: ChartData[];
    lastClose: number;
    error: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
  };
}

const initialState: PriceState = {
  currentPrice: 0,
  historicalData: {
    chartData: [],
    lastClose: 0,
    error: null,
    status: "idle",
  },
};

export const getHistoricalData = createAsyncThunk(
  "price/getHistoricalData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=1"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Validate the response data structure
      if (!data || !Array.isArray(data.prices) || data.prices.length === 0) {
        throw new Error("Invalid data format received from API");
      }

      const prices = data.prices;
      const lastClose = prices[prices.length - 1][1];

      return {
        prices,
        lastClose,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch historical data"
      );
    }
  }
);

const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {
    updateChartData: (state, action: PayloadAction<number[][]>) => {
      state.historicalData.chartData = action.payload.map(
        ([timestamp, price]) => ({
          timestamp,
          price,
        })
      );
    },
    updatePrice: (state, action: PayloadAction<number>) => {
      state.currentPrice = action.payload;
    },
  },
  // This is the extra reducers for the async thunk responsible for fetching the historical data
  extraReducers: (builder) => {
    // This is the case for when the data is fetched successfully
    builder.addCase(getHistoricalData.fulfilled, (state, action) => {
      state.historicalData.chartData = action.payload.prices.map(
        ([timestamp, price]: [number, number]) => ({
          timestamp,
          price,
        })
      );
      state.historicalData.lastClose = Math.round(action.payload.lastClose);
      state.historicalData.error = null;
      state.historicalData.status = "succeeded";
    });
    // This is the case for when the data is not fetched successfully
    builder.addCase(getHistoricalData.rejected, (state, action) => {
      state.historicalData.error = action.payload as string;
      state.historicalData.status = "failed";
    });
    // This is the case for when the data is being fetched
    builder.addCase(getHistoricalData.pending, (state) => {
      state.historicalData.error = null;
      state.historicalData.status = "loading";
    });
  },
});

export const { updateChartData, updatePrice } = priceSlice.actions;
export default priceSlice.reducer;
