import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { openModal } from "@/store/modalSlice";
import BitcoinPriceModule from "@/modules/bitcoin-price";
import Pnl from "@/components/PnL";
import { updatePrice, getHistoricalData } from "@/store/priceSlice";
import { setTradeBTCprice } from "@/store/tradesSlice";

import TradesList from "@/components/TradesList";
import Button from "@/components/ui/Button";
// import D3Chart from "@/components/ui/D3Chart";

import Chart from "@/components/Chart";
import { COLORS } from "@/constants/colors";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const currentPrice = useSelector(
    (state: RootState) => state.price.currentPrice
  );

  const historicalData = useSelector(
    (state: RootState) => state.price.historicalData
  );

  // Fetch the current price of Bitcoin every 5 seconds
  // Ideally this would be a websocket connection, but for simplicity we're calling native module every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await BitcoinPriceModule.getPrice();
        dispatch(updatePrice(Number(data.price)));
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    dispatch(getHistoricalData());
  }, [dispatch]);

  // For now, we're using the current price to set the trade price
  // In real life, solution would be much more sophisticated.
  // We would refetch the current price once placing a trade, recalculate, and proceed with trade only if user confirms new price
  // For simplicity and to not over-engineer the solution, we will be using the price from this moment
  function handleTradePress() {
    dispatch(setTradeBTCprice(currentPrice));
    dispatch(openModal());
  }

  return (
    <View style={styles.container}>
      <Pnl />
      <View style={styles.chartContainer}>
        {historicalData.status === "loading" ? (
          <ActivityIndicator size="large" color={COLORS.chart.line} />
        ) : historicalData.status === "failed" ? (
          <Text style={styles.errorText}>Failed to load chart data</Text>
        ) : (
          <>
            <Chart
              chartData={historicalData.chartData}
              lastClose={historicalData.lastClose}
            />
            <Button onPress={handleTradePress} title="Trade" />
          </>
        )}

        {/* Attempt of using D3Chart, but it's not working as expected. Leaving it here regardless for possible prestantaional purposes. In real life, this is dead code that should be removed */}
        {/*   <View style={{ height: 250 }}>
            <D3Chart />
          </View> */}
      </View>
      <View style={styles.tradesContainer}>
        <TradesList />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 20,
    gap: 16,
  },
  chartContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexGrow: 1,
  },
  tradesContainer: {
    maxHeight: 200,
    width: "100%",
  },
  errorText: { color: COLORS.text.error, textAlign: "center" },
});
export default HomePage;
