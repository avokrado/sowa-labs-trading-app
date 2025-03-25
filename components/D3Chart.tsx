import React, { FC, useMemo } from "react";
import { View, Dimensions, ActivityIndicator } from "react-native";
import Svg, { Path, Line, Circle, Text, Rect } from "react-native-svg";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Chart styling constants
const CHART_HEIGHT = 250;
const CHART_MARGIN = 20;
const Y_AXIS_WIDTH = 50;
const CHART_COLOR = "#008080";
const AXIS_COLOR = "#666";
const BACKGROUND_COLOR = "#fff";

interface D3AreaChartProps {
  referenceValue?: number;
}

const D3AreaChart: FC<D3AreaChartProps> = ({ referenceValue = 80000 }) => {
  // Grab data from Redux
  const { chartData } = useSelector(
    (state: RootState) => state.price.historicalData
  );

  // Convert to an array of prices
  const data = chartData
    .filter((_, i) => i % 5 === 0)
    .map((item) => item.price);

  // We'll highlight the last data point
  const highlightValue = Math.round(data[data.length - 1] ?? 0);

  // Screen width
  const { width: screenWidth } = Dimensions.get("window");
  // The drawable width for the chart
  const chartWidth = screenWidth - (CHART_MARGIN * 2 + Y_AXIS_WIDTH);

  // 1) Find raw min/max
  const rawMin = d3.min(data) ?? 0;
  const rawMax = d3.max(data) ?? 1;

  // 2) Expand domain to include referenceValue so line is visible
  const minVal = Math.min(rawMin, referenceValue);
  const maxVal = Math.max(rawMax, referenceValue);

  // X scale
  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([CHART_MARGIN, chartWidth - CHART_MARGIN]);
  }, [data, chartWidth]);

  // Y scale
  const yScale = d3
    .scaleLinear()
    .domain([minVal, maxVal])
    .range([CHART_HEIGHT - CHART_MARGIN, CHART_MARGIN]);

  // Area path
  const areaPath = useMemo(() => {
    const areaGenerator = d3
      .area<number>()
      .x((_, i) => xScale(i))
      .y0(yScale(minVal))
      .y1((d) => yScale(d));
    return areaGenerator(data) || "";
  }, [data, xScale, yScale, minVal]);

  // Line path
  const linePath = useMemo(() => {
    const lineGenerator = d3
      .line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d));
    return lineGenerator(data) || "";
  }, [data, xScale, yScale]);

  // Reference line Y
  const refY = yScale(referenceValue);

  // Highlight
  const highlightIndex = data.findIndex((val) => val === highlightValue);
  const highlightX = xScale(
    highlightIndex === -1 ? data.length - 1 : highlightIndex
  );
  const highlightY = yScale(highlightValue);

  // Y-axis ticks
  const yAxisTicks = useMemo(() => yScale.ticks(5), [yScale]);

  // Y-axis label rendering
  const renderYAxisTick = (tick: number) => (
    <React.Fragment key={tick}>
      <Text
        x={chartWidth - CHART_MARGIN + 5}
        y={yScale(tick)}
        fill={AXIS_COLOR}
        fontSize="10"
        textAnchor="start"
        dy="0.3em"
      >
        {Math.round(tick)}
      </Text>
    </React.Fragment>
  );

  // Build the text for "Prev close" label
  const refText = `Prev close ${referenceValue}`;
  // Estimate label width
  const CHAR_WIDTH = 7;
  const PADDING = 20;
  const rectHeight = 18;
  const textWidth = refText.length * CHAR_WIDTH + PADDING;

  return (
    <View
      style={{
        width: "100%",
        height: CHART_HEIGHT,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      {data.length > 0 ? (
        <Svg style={{ width: "100%", height: "100%" }}>
          {/* Y-axis ticks (optional) */}
          {yAxisTicks.map(renderYAxisTick)}

          {/* Dotted reference line at refY */}
          <Line
            x1={CHART_MARGIN}
            x2={chartWidth - CHART_MARGIN}
            y1={refY}
            y2={refY}
            stroke={CHART_COLOR}
            strokeWidth={1}
            strokeDasharray={[6, 3]}
          />

          {/* Area fill */}
          <Path d={areaPath} fill={`${CHART_COLOR}20`} />

          {/* Main line stroke */}
          <Path d={linePath} stroke={CHART_COLOR} strokeWidth={2} fill="none" />

          {/* Highlight dot */}
          <Circle cx={highlightX} cy={highlightY} r={4} fill={CHART_COLOR} />

          {/* Highlight label with teal background */}
          <Rect
            x={highlightX + 5}
            y={highlightY - 20}
            width={60}
            height={18}
            fill={CHART_COLOR}
            rx={4}
            ry={4}
          />
          <Text
            x={highlightX + 5 + 30}
            y={highlightY - 20 + 13}
            fill="#fff"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            {highlightValue}
          </Text>

          {/* 
          "Prev close" label aligned with the reference line's Y 
          but using highlightX for the X - moved to end to overlay
        */}
          <Rect
            x={highlightX - textWidth / 2}
            y={refY - rectHeight / 2} // center the rect vertically on the line
            width={textWidth}
            height={rectHeight}
            fill={"#3fbebe"}
            rx={4}
            ry={4}
          />
          <Text
            x={highlightX}
            y={refY + 3} // a bit below the center to align text baseline
            fill="#fff"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            {refText}
          </Text>
        </Svg>
      ) : (
        <ActivityIndicator size="large" color="#3fbebe" />
      )}
    </View>
  );
};

export default React.memo(D3AreaChart);
