import React from "react";
import { calculatePnL } from "@/utils/calculatePnL";
import { formatEurCurrency } from "@/utils/formatCurrency";
import { useMemo } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { COLORS } from "@/constants/colors";

export default function Pnl() {
  const currentPrice = useSelector(
    (state: RootState) => state.price.currentPrice
  );
  const btcBalance = useSelector(
    (state: RootState) => state.wallet.btcBalanceInSats
  );
  const trades = useSelector((state: RootState) => state.trades.trades);

  const formattedPrice = useMemo(() => {
    return formatEurCurrency(currentPrice);
  }, [currentPrice]);

  const pnL = useMemo(() => {
    return calculatePnL(trades, btcBalance, currentPrice);
  }, [trades, btcBalance, currentPrice]);

  const formattedTotalPnL = useMemo(() => {
    return formatEurCurrency(pnL.totalPnL);
  }, [pnL.totalPnL]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BTC</Text>
      {currentPrice ? (
        <>
          <Text style={styles.price}>{formattedPrice} €</Text>
          <Text
            style={pnL.totalPnL >= 0 ? styles.pnlPositive : styles.pnlNegative}
          >
            PnL: {formattedTotalPnL} €
          </Text>
        </>
      ) : (
        <ActivityIndicator size="large" color={COLORS.chart.line} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  pnl: {
    fontSize: 16,
  },
  pnlPositive: {
    fontSize: 16,
    color: COLORS.text.success,
  },
  pnlNegative: {
    fontSize: 16,
    color: COLORS.text.error,
  },
});
