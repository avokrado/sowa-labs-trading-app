import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Chart from "@/components/ui/Chart";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { formatCurrency } from "@/utils/formatCurrency";

function HomePage() {
  const currentPrice = useSelector(
    (state: RootState) => state.price.currentPrice
  );

  const formattedPrice = useMemo(() => {
    return formatCurrency(currentPrice);
  }, [currentPrice]);

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}>
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
        <Text style={{ fontSize: 16 }}>PnL: Not implemented</Text>
      </View>
      <Chart />
    </View>
  );
}

export default HomePage;
