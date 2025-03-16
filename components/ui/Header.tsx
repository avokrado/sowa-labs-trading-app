import React from "react";
import { View, Text } from "react-native";

function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
      }}
    >
      <Text>Logo</Text>
      <Text>Price</Text>
    </View>
  );
}

export default Header;
