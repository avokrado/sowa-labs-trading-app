import React from "react";
import { View, Text, ScrollView } from "react-native";
import Chart from "@/components/ui/Chart";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { openModal } from "@/store/modalSlice";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
import Pnl from "@/components/ui/PnL";

function HomePage() {
  const dispatch = useDispatch();

  const trades = useSelector((state: RootState) => state.trades.trades);
  const wsStatus = useSelector((state: RootState) => state.price.wsStatus);

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
          <Button
            onPress={handleTradePress}
            title="Trade"
            disabled={wsStatus !== "connected"}
          />
        </View>
      </View>
      <ScrollView
        style={{
          gap: 10,
          backgroundColor: "#edeff0",
          borderRadius: 10,
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
