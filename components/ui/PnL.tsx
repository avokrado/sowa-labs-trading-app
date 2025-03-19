import { calculatePnL } from "@/utils/calculatePnL";
import { formatCurrency } from "@/utils/formatCurrency";
import { useMemo } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Pnl() {
  const currentPrice = useSelector(
    (state: RootState) => state.price.currentPrice
  );
  const btcBalance = useSelector((state: RootState) => state.wallet.btcBalance);
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

  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "red",
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
  );
}
