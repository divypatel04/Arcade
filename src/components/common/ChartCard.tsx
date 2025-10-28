import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { colors, sizes, fonts, shadows } from '@theme';

const screenWidth = Dimensions.get('window').width;

export type ChartType = 'line' | 'bar' | 'pie';

export interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity?: number) => string;
    strokeWidth?: number;
  }>;
  legend?: string[];
}

export interface PieChartDataItem {
  name: string;
  population: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

export interface ChartCardProps {
  title: string;
  type: ChartType;
  data: ChartData | PieChartDataItem[];
  height?: number;
  showLegend?: boolean;
  style?: any;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  type,
  data,
  height = 220,
  showLegend = true,
  style,
}) => {
  const chartWidth = screenWidth - sizes.xl * 2;

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 70, 85, ${opacity})`, // Primary color
    labelColor: (opacity = 1) => `rgba(115, 115, 115, ${opacity})`, // Text secondary
    style: {
      borderRadius: sizes.borderRadius.lg,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.gray200,
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart
            data={data as ChartData}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withDots={true}
            withShadow={false}
            yAxisSuffix=""
            yAxisInterval={1}
          />
        );
      case 'bar':
        return (
          <BarChart
            data={data as ChartData}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            style={styles.chart}
            withInnerLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            yAxisLabel=""
            yAxisSuffix=""
            showBarTops={false}
            fromZero
          />
        );
      case 'pie':
        return (
          <PieChart
            data={data as PieChartDataItem[]}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
            hasLegend={showLegend}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>{renderChart()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    padding: sizes.md,
    marginVertical: sizes.sm,
    ...shadows.md,
  },
  title: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
    marginBottom: sizes.md,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    borderRadius: sizes.borderRadius.md,
  },
});

export default ChartCard;
