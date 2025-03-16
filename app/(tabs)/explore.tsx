import { StyleSheet, Image, Platform, Text } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import BitcoinPriceModule from "@/modules/bitcoin-price";
import { useEffect, useState } from "react";

export default function TabTwoScreen() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    // Get initial price
    BitcoinPriceModule.getCurrentPrice().then(setPrice);

    // Start price updates every 30 seconds (30000 milliseconds)
    BitcoinPriceModule.startPriceUpdates(1000);

    // Subscribe to price updates
    const subscription = BitcoinPriceModule.addListener(
      "onPriceUpdate",
      (event) => {
        setPrice(event.price);
      }
    );

    // Cleanup function
    return () => {
      BitcoinPriceModule.stopPriceUpdates();
      subscription.remove();
    };
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <Text> {price ? `$${price.toLocaleString()}` : "Loading..."}</Text>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
