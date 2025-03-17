import { RootState } from "@/store";
import { useSelector } from "react-redux";
import React from "react";
import { View, Text } from "react-native";
import { formatCurrency } from "@/utils/formatCurrency";

function Header() {
  const currentBalance = useSelector(
    (state: RootState) => state.portfolio.btcBalance
  );

  const currentPrice = useSelector(
    (state: RootState) => state.price.currentPrice
  );

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text>Logo</Text>
      <View style={{ gap: 4, alignItems: "flex-end" }}>
        <Text>Available</Text>
        <Text>
          {currentBalance} <Text style={{ fontWeight: "semibold" }}>BTC</Text>
        </Text>
        <Text>
          {formatCurrency(currentBalance * currentPrice)}{" "}
          <Text style={{ fontWeight: "semibold" }}>€</Text>
        </Text>
      </View>
    </View>
  );
}

export default Header;
