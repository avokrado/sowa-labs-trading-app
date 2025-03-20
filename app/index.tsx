import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import Chart from "@/components/ui/Chart";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { openModal } from "@/store/modalSlice";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import BitcoinPriceModule from "@/modules/bitcoin-price";
import Pnl from "@/components/ui/PnL";
import { updatePrice, getHistoricalData } from "@/store/priceSlice";
import { setTradeBTCprice } from "@/store/tradesSlice";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  // Ideally this would be a websocket connection
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

  const trades = useSelector((state: RootState) => state.trades.trades);

  const currentPrice = useSelector(
    (state: RootState) => state.price.currentPrice
  );
  const chartDataStatus = useSelector(
    (state: RootState) => state.price.historicalData.status
  );
  console.log(chartDataStatus);

  function handleTradePress() {
    /* 
      Sets the BTC price for the current trade.
      Note: In a production environment, we would:
      1. Fetch real-time BTC price when placing the trade
      2. Recalculate BTC amount
      3. Require user confirmation
      
      Using static price for demo purposes to go along with not over-engineering the solution
    */
    dispatch(setTradeBTCprice(currentPrice));
    dispatch(openModal());
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "green",
        padding: 16,
        gap: 16,
      }}
    >
      <Pnl />
      <View style={{ backgroundColor: "white", gap: 8 }}>
        {chartDataStatus === "loading" ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Chart />
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "blue",
                paddingHorizontal: 32,
              }}
            >
              <Button onPress={handleTradePress} title="Trade" />
            </View>
          </>
        )}
      </View>
      <ScrollView
        style={{
          gap: 10,
          backgroundColor: "#edeff0",
          padding: 10,
          width: "100%",
          height: "100%",
        }}
      >
        {trades.length === 0 ? (
          <View style={{ alignItems: "center" }}>
            <Text>No trades yet</Text>
          </View>
        ) : (
          trades.map((trade) => (
            <View
              key={trade.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: 24,
                backgroundColor: "red",
                alignItems: "center",
              }}
            >
              <Text>{trade.type}</Text>
              <Text>
                {trade.type === "BUY" ? "+" : "-"}
                {trade.amountInBTC.toFixed(4)} BTC /{" "}
                {trade.type === "BUY" ? "-" : "+"}
                {trade.amountInEUR} €
              </Text>
              <Text>
                {new Date(trade.timestamp).toLocaleTimeString("en-US", {
                  hour12: false,
                })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

export default HomePage;
