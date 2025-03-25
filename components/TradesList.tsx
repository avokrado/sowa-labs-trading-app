import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { COLORS } from "@/constants/colors";
export default function TradesList() {
  const trades = useSelector((state: RootState) => state.trades.trades);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {trades.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No trades yet</Text>
          </View>
        ) : (
          trades.map((trade) => (
            <View key={trade.id} style={styles.tradeRow}>
              <Text>{trade.type}</Text>
              <Text style={styles.boldText}>
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    backgroundColor: COLORS.tradeList.background,
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tradeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 24,
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
});
