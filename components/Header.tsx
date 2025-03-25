import { RootState } from "@/store";
import { useSelector } from "react-redux";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { formatEurCurrency } from "@/utils/formatCurrency";
import { satsToBtc } from "@/utils/convertSatoshis";
import { COLORS } from "@/constants/colors";

function Header() {
  const currentBTCBalance = useSelector(
    (state: RootState) => state.wallet.btcBalanceInSats
  );
  const currentEURBalance = useSelector(
    (state: RootState) => state.wallet.eurBalance
  );

  const decimalBTC = satsToBtc(currentBTCBalance);
  const formattedBTC = decimalBTC !== 0 ? decimalBTC.toFixed(8) : 0;

  return (
    <View style={styles.container}>
      {/* In real life with correct asset, we would produce x1, x2, x3, etc. logos */}
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
      <View style={styles.balanceContainer}>
        <Text>Available</Text>
        <Text>
          {formattedBTC} <Text style={styles.bold}>BTC</Text>
        </Text>
        <Text>
          {formatEurCurrency(currentEURBalance)}{" "}
          <Text style={styles.bold}>€</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 55,
    height: 55,
  },
  balanceContainer: {
    gap: 4,
    alignItems: "flex-end",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default Header;
