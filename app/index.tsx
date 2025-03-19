import React from "react";
import { View, Text, ScrollView } from "react-native";
import Chart from "@/components/ui/Chart";
import { useGetBitcoinPriceQuery } from "@/store/api/bitcoinPriceApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { openModal } from "@/store/modalSlice";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import BitcoinPriceModule from "@/modules/bitcoin-price";
import Pnl from "@/components/ui/PnL";
import { updatePrice } from "@/store/priceSlice";

function HomePage() {
  const dispatch = useDispatch();

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

  const trades = useSelector((state: RootState) => state.trades.trades);

  function handleTradePress() {
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
      <View style={{ backgroundColor: "blue", gap: 8 }}>
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
