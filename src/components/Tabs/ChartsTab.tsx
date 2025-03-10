import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import DropDown from '../DropDown';

// Remove the direct chart imports since they're causing issues
// Instead, we'll create custom visualization components

const screenWidth = Dimensions.get('window').width - (sizes['3xl'] * 2);

const ChartsTab = () => {
  // Chart type selection
  const chartTypes = ['Performance', 'Accuracy', 'Weapon Usage'];
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0]);

  // Custom Performance Chart Component
  const renderPerformanceChart = () => {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Match Performance</Text>
        <Text style={styles.chartSubtitle}>KDA Comparison Over Last 5 Matches</Text>

        {/* Simple custom bar chart instead of SVG-based chart */}
        <View style={styles.customChartContainer}>
          {[
            {match: "Match 1", kills: 22, deaths: 8},
            {match: "Match 2", kills: 15, deaths: 12},
            {match: "Match 3", kills: 28, deaths: 10},
            {match: "Match 4", kills: 19, deaths: 17},
            {match: "Match 5", kills: 30, deaths: 7}
          ].map((item, index) => (
            <View key={index} style={styles.chartColumn}>
              <View style={styles.barContainer}>
                <View style={[styles.bar, styles.killsBar, {height: item.kills * 3}]} />
                <View style={[styles.bar, styles.deathsBar, {height: item.deaths * 3}]} />
              </View>
              <Text style={styles.barLabel}>{`M${index+1}`}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.win }]} />
            <Text style={styles.legendText}>Kills</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.lose }]} />
            <Text style={styles.legendText}>Deaths</Text>
          </View>
        </View>
      </View>
    );
  };

  // Custom Accuracy Chart Component
  const renderAccuracyChart = () => {
    // Accuracy data
    const headshots = 38;
    const bodyshots = 52;
    const legshots = 10;

    return (
      <View style={styles.chartContainer}></View>
        <Text style={styles.chartTitle}>Shot Accuracy</Text>
        <Text style={styles.chartSubtitle}>Distribution of Hit Locations</Text>

        {/* Custom pie chart visualization */}
        <View style={styles.pieChartContainer}>
          <View style={styles.pieContainer}>
            <View style={[styles.pieSegment, {
              backgroundColor: colors.win,
              width: 120,
              height: 120,
              borderTopRightRadius: 0,
              transform: [{ rotate: '0deg' }]
            }]} />
            <View style={[styles.pieSegment, {
              backgroundColor: colors.primary,
              width: 120,
              height: 120,
              transform: [{ rotate: `${headshots * 3.6}deg` }]
            }]} />
            <View style={[styles.pieSegment, {
              backgroundColor: colors.lose,
              width: 120,
              height: 120,
              transform: [{ rotate: `${(headshots + bodyshots) * 3.6}deg` }]
            }]} />
            <View style={styles.pieCenter} />
          </View>

          <View style={styles.pieLegend}>
            <View style={styles.legendRow}>
              <View style={[styles.legendMarker, {backgroundColor: colors.win}]} />
              <Text style={styles.legendLabel}>Headshots</Text>
              <Text style={styles.legendValue}>{headshots}%</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendMarker, {backgroundColor: colors.primary}]} />
              <Text style={styles.legendLabel}>Bodyshots</Text>
              <Text style={styles.legendValue}>{bodyshots}%</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendMarker, {backgroundColor: colors.lose}]} />
              <Text style={styles.legendLabel}>Legshots</Text>
              <Text style={styles.legendValue}>{legshots}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>38%</Text>
            <Text style={styles.statLabel}>HEADSHOT</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2.4</Text>
            <Text style={styles.statLabel}>K/D</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>83%</Text>
            <Text style={styles.statLabel}>WIN RATE</Text>
          </View>
        </View>
      </View>
    );
  };

  // Custom Weapon Usage Chart Component
  const renderWeaponUsageChart = () => {
    const weapons = [
      {name: "Vandal", percentage: 65, kills: 134, headshots: 27},
      {name: "Phantom", percentage: 23, kills: 48, headshots: 15},
      {name: "Operator", percentage: 12, kills: 25, headshots: 8},
      {name: "Sheriff", percentage: 8, kills: 16, headshots: 12},
      {name: "Classic", percentage: 5, kills: 10, headshots: 3}
    ];

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weapon Preference</Text>
        <Text style={styles.chartSubtitle}>% of Kills with Each Weapon</Text>

        {/* Custom horizontal bar chart */}
        <View style={styles.weaponBarsContainer}>
          {weapons.slice(0, 3).map((weapon, index) => (
            <View key={index} style={styles.weaponBarRow}>
              <Text style={styles.weaponBarLabel}>{weapon.name}</Text>
              <View style={styles.weaponBarContainer}>
                <View
                  style={[styles.weaponBar, {width: `${weapon.percentage}%`}]}
                />
                <Text style={styles.weaponBarValue}>{weapon.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.weaponStatsContainer}>
          <View style={styles.weaponStat}>
            <Text style={styles.weaponName}>VANDAL</Text>
            <Text style={styles.weaponStatText}>65% • 134 KILLS • 27 HEADSHOTS</Text>
          </View>
          <View style={styles.weaponStat}>
            <Text style={styles.weaponName}>PHANTOM</Text>
            <Text style={styles.weaponStatText}>23% • 48 KILLS • 15 HEADSHOTS</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderSelectedChart = () => {
    switch (selectedChartType) {
      case 'Performance':
        return renderPerformanceChart();
      case 'Accuracy':
        return renderAccuracyChart();
      case 'Weapon Usage':
        return renderWeaponUsageChart();
      default:
        return null;
    }
  };

  const renderSummaryMetrics = () => {
    return (
      <View style={styles.metricsContainer}>
        <Text style={styles.metricsTitle}>PERFORMANCE METRICS</Text>

        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>1.8</Text>
            <Text style={styles.metricLabel}>First Kill Ratio</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>78%</Text>
            <Text style={styles.metricLabel}>Clutch Success</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>163</Text>
            <Text style={styles.metricLabel}>ADR</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>3.2</Text>
            <Text style={styles.metricLabel}>KAST</Text>
          </View>
        </View>

        <Text style={styles.improvementNote}>
          Your headshot percentage has increased by 8% over the last 10 matches.
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.tabContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.dropdownContainer}>
        <DropDown
          list={chartTypes}
          name="Chart"
          value={selectedChartType}
          onSelect={item => setSelectedChartType(item)}
        />
      </View>

      {renderSelectedChart()}
      {renderSummaryMetrics()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes['3xl'],
    flex: 1,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: sizes.lg,
  },
  chartContainer: {
    backgroundColor: colors.primary,
    padding: sizes.xl,
    marginBottom: sizes['2xl'],
    borderRadius: 8,
  },
  chartTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['4xl'],
    color: colors.black,
    marginBottom: sizes.xs,
  },
  chartSubtitle: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    marginBottom: sizes.lg,
  },
  // Custom chart styles for bar chart
  customChartContainer: {
    height: 220,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingVertical: sizes.lg,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  chartColumn: {
    alignItems: 'center',
    width: 40,
  },
  barContainer: {
    flexDirection: 'row',
    height: 180,
    alignItems: 'flex-end',
  },
  bar: {
    width: 15,
    marginHorizontal: 2,
  },
  killsBar: {
    backgroundColor: colors.win,
  },
  deathsBar: {
    backgroundColor: colors.lose,
  },
  barLabel: {
    marginTop: sizes.xs,
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: sizes.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: sizes.md,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: sizes.xs,
  },
  legendText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  // Custom pie chart styles
  pieChartContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 220,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: sizes.lg,
    alignItems: 'center',
  },
  pieContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    position: 'relative',
  },
  pieSegment: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  pieCenter: {
    position: 'absolute',
    top: '35%',
    left: '35%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  pieLegend: {
    marginLeft: sizes.xl,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: sizes.sm,
  },
  legendLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
    width: 80,
  },
  legendValue: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
    marginLeft: sizes.md,
  },
  // Weapon usage bars
  weaponBarsContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: sizes.xl,
    marginBottom: sizes.lg,
  },
  weaponBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  weaponBarLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.black,
    width: 70,
  },
  weaponBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: colors.darkGray + '20',
    borderRadius: 4,
    overflow: 'hidden',
  },
  weaponBar: {
    height: '100%',
    backgroundColor: colors.win,
  },
  weaponBarValue: {
    position: 'absolute',
    right: 8,
    color: colors.black,
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    alignSelf: 'center',
  },
  // Rest of existing styles
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: sizes.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['6xl'],
    color: colors.black,
  },
  statLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
    marginTop: sizes.xs,
  },
  weaponStatsContainer: {
    marginTop: sizes.lg,
  },
  weaponStat: {
    marginBottom: sizes.md,
  },
  weaponName: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
  },
  weaponStatText: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  metricsContainer: {
    backgroundColor: colors.primary,
    padding: sizes.xl,
    marginBottom: sizes['6xl'],
    borderRadius: 8,
  },
  metricsTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.lg,
    textAlign: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes.lg,
  },
  metric: {
    width: '48%',
    backgroundColor: colors.white + '40',
    borderRadius: 8,
    padding: sizes.lg,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['6xl'],
    color: colors.black,
  },
  metricLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
    marginTop: sizes.xs,
  },
  improvementNote: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.win,
    marginTop: sizes.lg,
    textAlign: 'center',
    backgroundColor: colors.win + '20',
    padding: sizes.md,
    borderRadius: 4,
  },
});

export default ChartsTab;
