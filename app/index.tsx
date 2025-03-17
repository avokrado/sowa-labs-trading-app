import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Chart from "@/components/ui/Chart";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { formatCurrency } from "@/utils/formatCurrency";
import { calculatePnL } from "@/utils/calculatePnL";
import { openModal } from "@/store/modalSlice";
import { useDispatch } from "react-redux";
import Button from "@/components/ui/Button";
function HomePage() {
  const dispatch = useDispatch();
  const currentPrice = useSelector(
    (state: RootState) => state.price.currentPrice
  );
  const btcBalance = useSelector(
    (state: RootState) => state.portfolio.btcBalance
  );
  const trades = useSelector((state: RootState) => state.trades.trades);

  const formattedPrice = useMemo(() => {
    return formatCurrency(currentPrice);
  }, [currentPrice]);

  const pnL = useMemo(() => {
    return calculatePnL(trades, btcBalance, currentPrice);
  }, [trades, btcBalance, currentPrice]);

  const formattedTotalPnL = useMemo(() => {
    return formatCurrency(pnL.totalPnL);
  }, [pnL.totalPnL]);

  function handleTradePress() {
    dispatch(openModal());
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 32,
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "semibold" }}>BTC</Text>
        <Text style={{ fontSize: 24, fontWeight: "semibold" }}>
          {formattedPrice} €
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: pnL.totalPnL >= 0 ? "#16a34a" : "#dc2626",
          }}
        >
          PnL: {formattedTotalPnL} €
        </Text>
      </View>
      <Chart />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button onPress={handleTradePress} title="Trade" disabled={!currentPrice} />
      </View>
    </View>
  );
}

export default HomePage;
