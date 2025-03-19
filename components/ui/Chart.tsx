import React from "react";
import { Dimensions, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { updateChartData } from "@/store/priceSlice";
import { RootState } from "@/store";

function Chart() {
  const dispatch = useDispatch();
  const chartData = useSelector((state: RootState) => state.price.chartData);
  useQuery({
    queryKey: ["chart-data"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=1"
      );
      const data = await response.json();
      dispatch(updateChartData(data.prices));
      return data.prices;
    },
    enabled: chartData.length === 0,
  });

  return chartData.length > 0 ? (
    <LineChart
      data={{
        labels: [], // You can fill these if you want specific labels
        datasets: [
          {
            data: chartData
              .filter((_, i) => i % 10 === 0)
              .map((item) => item.price),
          },
        ],
      }}
      width={Dimensions.get("window").width}
      height={Dimensions.get("window").height * 0.4}
      yAxisLabel="€"
      withDots={false}
      chartConfig={{
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        fillShadowGradientFrom: "#46c9e3",
        fillShadowGradientTo: "#ffffff",
        fillShadowGradientOpacity: 0.7,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      }}
      bezier
      withVerticalLines={false}
      withHorizontalLines={true}
    />
  ) : (
    <Text>No data</Text>
  );
}
// Use memo so that the chart is not re-rendered when the data in parent component is updated
export default React.memo(Chart);
