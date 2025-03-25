import { COLORS } from "@/constants/colors";
import { ChartData } from "@/store/priceSlice";
import React from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const Y_AXIS_LABEL_WIDTH = 50;
const CHART_WIDTH = Dimensions.get("window").width - 100;

/* 
  Note to reviewer:
  I've used react-native-gifted-charts library for the chart since it promised best results
  Library is unreliable, and due to lack of time, implementation of it is not perfect.
  Missing features:
  - Styled current price label on Y axis
  - Reference line label overlaying Y axis

  On real project, usage of existing established charting library shouldn't cause any issues 
*/
export default function Chart({
  chartData,
  lastClose,
}: {
  chartData: ChartData[];
  lastClose: number;
}) {
  const customDataPoint = () => {
    return <View style={styles.dataPoint} />;
  };

  const data = chartData
    .filter((_, index) => index % 10 === 0) // Reduce data density
    .map((item, index, array) => ({
      value: item.price,
      date: item.timestamp,
      customDataPoint: index === array.length - 1 ? customDataPoint : undefined,
      hideDataPoint: index === array.length - 1 ? false : true,
    }));

  const minPrice = Math.round(Math.min(...data.map((item) => item.value)));

  if (!data.length) return null;
  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        yAxisOffset={minPrice}
        yAxisSide={1}
        xAxisThickness={0}
        yAxisThickness={0}
        adjustToWidth={true}
        noOfSections={5}
        color={COLORS.chart.line}
        yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
        thickness={2}
        yAxisTextStyle={styles.yAxisText}
        showReferenceLine1={true}
        hideRules
        referenceLine1Position={lastClose}
        referenceLinesOverChartContent={true}
        referenceLine1Config={{
          thickness: 1,
          dashWidth: 2,
          dashGap: 8,
          color: COLORS.chart.reference,
          labelText: `Prev close ${lastClose}`,
          labelTextStyle: styles.referenceLineLabel,
        }}
        areaChart={true}
        startFillColor={COLORS.chart.reference}
        endFillColor="rgba(63, 190, 190, 0.2)"
        startOpacity={0.8}
        endOpacity={0}
        width={CHART_WIDTH}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: Y_AXIS_LABEL_WIDTH,
  },
  dataPoint: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.chart.line,
    borderRadius: 4,
  },
  yAxisText: {
    color: COLORS.chart.line,
  },
  referenceLineLabel: {
    color: COLORS.button.text,
    top: -12,
    backgroundColor: COLORS.chart.reference,
    padding: 4,
    borderRadius: 4,
    right: 0,
  },
});
