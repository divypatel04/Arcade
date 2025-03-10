import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import { Icon } from '../lcon';

interface RoundPerformance {
  roundNumber: number;
  outcome: 'win' | 'loss';
  impactScore: number; // Overall contribution to round (0-100)
  combat: {
    kills: number;
    deaths: number;
    assists: number;
    damageDealt: number;
    headshotPercentage: number;
    tradedKill: boolean; // Was player's death traded by teammate
    tradeKill: boolean;  // Did player trade a teammate's death
  };
  economy: {
    weaponType: string;
    armorType: string;
    creditSpent: number;
    loadoutValue: number;
    enemyLoadoutValue: number;
  };
  positioning: {
    site: string; // A, B, Mid
    positionType: 'aggressive' | 'passive' | 'lurk';
    firstContact: boolean; // First to encounter enemies
    timeToFirstContact: number; // Seconds into round
  };
  utility: {
    abilitiesUsed: number;
    totalAbilities: number;
    utilityDamage: number;
  };
  improvement: string[]; // Areas to improve from this round
}

const RoundPerfTab = () => {
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'wins' | 'losses'>('all');
  const screenWidth = Dimensions.get('window').width;

  // Dummy round performance data
  const roundPerformanceData: RoundPerformance[] = [
    {
      roundNumber: 1,
      outcome: 'win',
      impactScore: 82,
      combat: {
        kills: 2,
        deaths: 0,
        assists: 1,
        damageDealt: 243,
        headshotPercentage: 50,
        tradedKill: false,
        tradeKill: false
      },
      economy: {
        weaponType: 'Classic',
        armorType: 'Light Shield',
        creditSpent: 800,
        loadoutValue: 800,
        enemyLoadoutValue: 800
      },
      positioning: {
        site: 'A Site',
        positionType: 'aggressive',
        firstContact: true,
        timeToFirstContact: 12
      },
      utility: {
        abilitiesUsed: 2,
        totalAbilities: 3,
        utilityDamage: 40
      },
      improvement: ['Utility usage', 'Early positioning']
    },
    {
      roundNumber: 2,
      outcome: 'loss',
      impactScore: 45,
      combat: {
        kills: 1,
        deaths: 1,
        assists: 0,
        damageDealt: 120,
        headshotPercentage: 0,
        tradedKill: false,
        tradeKill: false
      },
      economy: {
        weaponType: 'Ghost',
        armorType: 'Light Shield',
        creditSpent: 1200,
        loadoutValue: 1500,
        enemyLoadoutValue: 2100
      },
      positioning: {
        site: 'B Site',
        positionType: 'passive',
        firstContact: false,
        timeToFirstContact: 28
      },
      utility: {
        abilitiesUsed: 1,
        totalAbilities: 3,
        utilityDamage: 0
      },
      improvement: ['Trading teammate deaths', 'Crosshair placement']
    },
    {
      roundNumber: 3,
      outcome: 'win',
      impactScore: 95,
      combat: {
        kills: 3,
        deaths: 0,
        assists: 1,
        damageDealt: 432,
        headshotPercentage: 66,
        tradedKill: false,
        tradeKill: true
      },
      economy: {
        weaponType: 'Vandal',
        armorType: 'Heavy Shield',
        creditSpent: 3900,
        loadoutValue: 3900,
        enemyLoadoutValue: 2800
      },
      positioning: {
        site: 'Mid',
        positionType: 'lurk',
        firstContact: false,
        timeToFirstContact: 35
      },
      utility: {
        abilitiesUsed: 3,
        totalAbilities: 4,
        utilityDamage: 75
      },
      improvement: []
    },
    {
      roundNumber: 4,
      outcome: 'loss',
      impactScore: 35,
      combat: {
        kills: 0,
        deaths: 1,
        assists: 0,
        damageDealt: 78,
        headshotPercentage: 0,
        tradedKill: true,
        tradeKill: false
      },
      economy: {
        weaponType: 'Spectre',
        armorType: 'Light Shield',
        creditSpent: 2000,
        loadoutValue: 2000,
        enemyLoadoutValue: 4200
      },
      positioning: {
        site: 'B Site',
        positionType: 'aggressive',
        firstContact: true,
        timeToFirstContact: 8
      },
      utility: {
        abilitiesUsed: 2,
        totalAbilities: 4,
        utilityDamage: 26
      },
      improvement: ['Pre-aim common angles', 'Pace of aggression', 'Economy management']
    },
    {
      roundNumber: 5,
      outcome: 'win',
      impactScore: 72,
      combat: {
        kills: 1,
        deaths: 1,
        assists: 2,
        damageDealt: 345,
        headshotPercentage: 100,
        tradedKill: false,
        tradeKill: false
      },
      economy: {
        weaponType: 'Vandal',
        armorType: 'Heavy Shield',
        creditSpent: 3900,
        loadoutValue: 3900,
        enemyLoadoutValue: 4700
      },
      positioning: {
        site: 'A Site',
        positionType: 'passive',
        firstContact: false,
        timeToFirstContact: 22
      },
      utility: {
        abilitiesUsed: 4,
        totalAbilities: 4,
        utilityDamage: 130
      },
      improvement: ['Post-plant positioning']
    },
    {
      roundNumber: 6,
      outcome: 'loss',
      impactScore: 15,
      combat: {
        kills: 0,
        deaths: 1,
        assists: 0,
        damageDealt: 0,
        headshotPercentage: 0,
        tradedKill: false,
        tradeKill: false
      },
      economy: {
        weaponType: 'Marshal',
        armorType: 'No Shield',
        creditSpent: 1100,
        loadoutValue: 1100,
        enemyLoadoutValue: 3800
      },
      positioning: {
        site: 'Mid',
        positionType: 'aggressive',
        firstContact: true,
        timeToFirstContact: 5
      },
      utility: {
        abilitiesUsed: 0,
        totalAbilities: 2,
        utilityDamage: 0
      },
      improvement: ['Eco round positioning', 'Team coordination', 'Utility usage']
    },
    {
      roundNumber: 7,
      outcome: 'win',
      impactScore: 100,
      combat: {
        kills: 4,
        deaths: 0,
        assists: 0,
        damageDealt: 580,
        headshotPercentage: 75,
        tradedKill: false,
        tradeKill: false
      },
      economy: {
        weaponType: 'Operator',
        armorType: 'Heavy Shield',
        creditSpent: 4700,
        loadoutValue: 4700,
        enemyLoadoutValue: 4200
      },
      positioning: {
        site: 'B Site',
        positionType: 'passive',
        firstContact: false,
        timeToFirstContact: 18
      },
      utility: {
        abilitiesUsed: 4,
        totalAbilities: 4,
        utilityDamage: 95
      },
      improvement: []
    },
  ];

  // Get rounds by filter
  const getFilteredRounds = () => {
    switch (filterMode) {
      case 'wins':
        return roundPerformanceData.filter(round => round.outcome === 'win');
      case 'losses':
        return roundPerformanceData.filter(round => round.outcome === 'loss');
      default:
        return roundPerformanceData;
    }
  };

  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    let totalImpact = 0;
    let totalKills = 0;
    let totalDeaths = 0;
    let totalDamage = 0;
    let totalRounds = roundPerformanceData.length;
    let openingDuelsWon = 0;
    let totalOpeningDuels = 0;
    let tradeEfficiency = 0;
    let tradeOpportunities = 0;
    let utilityEfficiency = 0;

    roundPerformanceData.forEach(round => {
      totalImpact += round.impactScore;
      totalKills += round.combat.kills;
      totalDeaths += round.combat.deaths;
      totalDamage += round.combat.damageDealt;

      if (round.positioning.firstContact) {
        totalOpeningDuels++;
        if (round.outcome === 'win') openingDuelsWon++;
      }

      if (round.combat.tradeKill) tradeEfficiency++;
      if (round.combat.deaths === 1) tradeOpportunities++;

      utilityEfficiency += round.utility.abilitiesUsed / round.utility.totalAbilities;
    });

    // Collect areas for improvement from all rounds
    const allImprovementAreas = roundPerformanceData.flatMap(r => r.improvement);
    const improvementCount: Record<string, number> = {};
    allImprovementAreas.forEach(area => {
      if (!improvementCount[area]) improvementCount[area] = 0;
      improvementCount[area]++;
    });

    // Sort improvement areas by frequency
    const sortedImprovements = Object.entries(improvementCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([area]) => area);

    return {
      averageImpact: Math.round(totalImpact / totalRounds),
      killDeathRatio: totalDeaths > 0 ? +(totalKills / totalDeaths).toFixed(2) : totalKills,
      averageDamage: Math.round(totalDamage / totalRounds),
      openingDuelWinRate: totalOpeningDuels > 0 ?
        Math.round((openingDuelsWon / totalOpeningDuels) * 100) : 0,
      tradeEfficiencyRate: tradeOpportunities > 0 ?
        Math.round((tradeEfficiency / tradeOpportunities) * 100) : 0,
      utilityEfficiency: Math.round((utilityEfficiency / totalRounds) * 100),
      topImprovement: sortedImprovements
    };
  };

  const metrics = calculatePerformanceMetrics();

  // Helper function for impact score color
  const getImpactScoreColor = (score: number) => {
    if (score >= 80) return colors.win;
    if (score >= 50) return "#FFA500"; // Orange
    return colors.lose;
  };

  // Function to generate progress bar width based on a score
  const getProgressWidth = (value: number, max: number) => {
    return `${Math.min(100, (value / max) * 100)}%`;
  };

  return (
    <View>
    <View style={styles.container}>
      {/* Performance Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>PERFORMANCE SUMMARY</Text>
        <View style={styles.metricsContainer}>
          <View style={styles.metricColumn}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.averageImpact}</Text>
              <Text style={styles.metricLabel}>IMPACT</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.killDeathRatio}</Text>
              <Text style={styles.metricLabel}>K/D</Text>
            </View>
          </View>

          <View style={styles.metricColumn}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.openingDuelWinRate}%</Text>
              <Text style={styles.metricLabel}>1ST DUELS</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.averageDamage}</Text>
              <Text style={styles.metricLabel}>AVG DMG</Text>
            </View>
          </View>
        </View>

        <View style={styles.improvementSection}>
          <Text style={styles.improvementTitle}>FOCUS ON IMPROVING</Text>
          <View style={styles.improvementList}>
            {metrics.topImprovement.map((area, index) => (
              <View key={index} style={styles.improvementItem}>
                <Icon name="flashlight-line" size={14} color={colors.darkGray} />
                <Text style={styles.improvementText}>{area}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'all' && styles.activeFilterTab]}
          onPress={() => setFilterMode('all')}
        >
          <Text style={[styles.filterText, filterMode === 'all' && styles.activeFilterText]}>All Rounds</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'wins' && styles.activeFilterTab]}
          onPress={() => setFilterMode('wins')}
        >
          <Text style={[styles.filterText, filterMode === 'wins' && styles.activeFilterText]}>Wins</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filterMode === 'losses' && styles.activeFilterTab]}
          onPress={() => setFilterMode('losses')}
        >
          <Text style={[styles.filterText, filterMode === 'losses' && styles.activeFilterText]}>Losses</Text>
        </TouchableOpacity>
      </View>

      {/* Round timeline */}
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>ROUND TIMELINE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineScroll}>
          {roundPerformanceData.map((round) => (
            <TouchableOpacity
              key={round.roundNumber}
              style={[
                styles.timelineItem,
                round.outcome === 'win' ? styles.timelineWin : styles.timelineLoss,
                selectedRound === round.roundNumber && styles.timelineSelected
              ]}
              onPress={() => setSelectedRound(round.roundNumber === selectedRound ? null : round.roundNumber)}
            >
              <Text style={styles.timelineNumber}>{round.roundNumber}</Text>
              <View
                style={[
                  styles.impactIndicator,
                  { backgroundColor: getImpactScoreColor(round.impactScore) }
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Round details */}
      <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
        {getFilteredRounds().map((round) => (
          <>
          <View
            key={round.roundNumber}
            style={[
              styles.roundCard,
              selectedRound === round.roundNumber && styles.selectedRoundCard,
              { opacity: selectedRound && selectedRound !== round.roundNumber ? 0.6 : 1 }
            ]}
          >
            <View style={styles.roundHeaderRow}>
              <View style={styles.roundNumberBadge}>
                <Text style={styles.roundNumberText}>{round.roundNumber}</Text>
              </View>
            </View>

            <View style={styles.roundOutcome}>
              <Text
                style={[
                  styles.outcomeText,
                  { color: round.outcome === 'win' ? colors.win : colors.lose }
                ]}
              >
              {round.outcome.toUpperCase()}
              </Text>
            </View>

            <View style={styles.impactScoreContainer}>
              <Text
                style={[
                  styles.impactScore,
                  { color: getImpactScoreColor(round.impactScore) }
                ]}
              >
                {round.impactScore}
              </Text>
              <Text style={styles.impactLabel}>IMPACT</Text>
            </View>
          </View>

          <View style={styles.roundStatsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>K/D/A</Text>
                <Text style={styles.statValue}>
                  {round.combat.kills}/{round.combat.deaths}/{round.combat.assists}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>DAMAGE</Text>
                <Text style={styles.statValue}>{round.combat.damageDealt}</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>HS%</Text>
                <Text style={styles.statValue}>{round.combat.headshotPercentage}%</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>LOADOUT</Text>
                <Text style={styles.statValue}>{round.economy.weaponType}</Text>
              </View>
            </View>

            <View style={styles.positioningContainer}>
                <View style={styles.sitePosition}>
                  <Text style={styles.siteLabel}>SITE</Text>
                  <Text style={styles.siteValue}>{round.positioning.site}</Text>
                </View>

                <View style={styles.positionTags}>
                  <View
                    style={[
                      styles.positionTag,
                      { backgroundColor: round.positioning.firstContact ? colors.lose + '30' : colors.darkGray + '20' }
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: round.positioning.firstContact ? colors.lose : colors.darkGray }
                      ]}
                    >
                      {round.positioning.firstContact ? 'FIRST CONTACT' : 'SUPPORT'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.positionTag,
                      { backgroundColor: colors.darkGray + '20' }
                    ]}
                  >
                    <Text style={styles.tagText}>{round.positioning.positionType.toUpperCase()}</Text>
                  </View>
                </View>
              </View >

            <View style={styles.utilitySection}>
                <Text style={styles.utilityTitle}>UTILITY USAGE</Text>
                <View style={styles.utilityBar}>
                  <View
                    style={[
                      styles.utilityProgress,
                      { width: `${(round.utility.abilitiesUsed / round.utility.totalAbilities) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.utilityText}>
                  {round.utility.abilitiesUsed}/{round.utility.totalAbilities} abilities • {round.utility.utilityDamage} damage
                </Text>
              </View>

              {
                round.improvement.length > 0 && (
                  <View style={styles.improvementList}>
                    <Text style={styles.improvementListTitle}>AREAS TO IMPROVE</Text>
                    {round.improvement.map((item, index) => (
                      <View key={index} style={styles.improvementListItem}>
                        <Icon name="checkbox-blank-circle-fill" size={6} color={colors.darkGray} />
                        <Text style={styles.improvementItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )
              }
          </View>
          </>
        ))}
      </ScrollView >
    </View >
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: sizes.xl,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: sizes.xl,
    margin: sizes.md,
    marginBottom: sizes.lg,
  },
  summaryTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
    marginBottom: sizes.md,
    textTransform: 'uppercase',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: sizes.md,
  },
  metricColumn: {
    width: '48%',
  },
  metricItem: {
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: sizes.lg,
    marginBottom: sizes.md,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['4xl'],
    color: colors.black,
  },
  metricLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
    marginTop: 2,
  },
  improvementSection: {
    marginTop: sizes.sm,
    paddingTop: sizes.md,
    borderTopWidth: 1,
    borderTopColor: colors.darkGray + '20',
  },
  improvementTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    marginBottom: sizes.sm,
  },
  improvementList: {
    marginTop: sizes.xs,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.xs,
  },
  improvementText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.black,
    marginLeft: sizes.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: sizes.md,
    marginBottom: sizes.md,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.primary + '40',
  },
  filterTab: {
    flex: 1,
    paddingVertical: sizes.md,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  activeFilterText: {
    color: colors.black,
  },
  timelineContainer: {
    marginHorizontal: sizes.md,
    marginBottom: sizes.md,
  },
  timelineTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
    marginBottom: sizes.sm,
  },
  timelineScroll: {
    paddingBottom: sizes.sm,
  },
  timelineItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: sizes.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timelineWin: {
    backgroundColor: colors.win + '30',
  },
  timelineLoss: {
    backgroundColor: colors.lose + '30',
  },
  timelineSelected: {
    borderWidth: 2,
    borderColor: colors.black,
  },
  timelineNumber: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
  },
  impactIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 8,
    height: 3,
    borderRadius: 2,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: sizes.md,
  },
  roundCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginBottom: sizes.md,
    overflow: 'hidden',
  },
  selectedRoundCard: {
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  roundHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizes.lg,
    backgroundColor: colors.primary + '90',
  },
  roundNumberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundNumberText: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.md,
    color: colors.white,
  },
  roundOutcome: {
    flex: 1,
    marginLeft: sizes.md,
  },
  outcomeText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    fontWeight: 'bold',
  },
  impactScoreContainer: {
    alignItems: 'center',
  },
  impactScore: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['4xl'],
    lineHeight: fonts.sizes['4xl'],
  },
  impactLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
  },
  roundStatsContainer: {
    padding: sizes.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.lg,
    color: colors.black,
  },
  positioningContainer: {
    backgroundColor: colors.white + '40',
    padding: sizes.md,
    borderRadius: 6,
    marginBottom: sizes.md,
  },
  sitePosition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  siteLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
    marginRight: sizes.xs,
  },
  siteValue: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
  },
  positionTags: {
    flexDirection: 'row',
  },
  positionTag: {
    paddingVertical: sizes.xs,
    paddingHorizontal: sizes.sm,
    borderRadius: 4,
    marginRight: sizes.sm,
  },
  tagText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
  },
  utilitySection: {
    marginTop: sizes.sm,
    marginBottom: sizes.lg,
  },
  utilityTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
    marginBottom: sizes.xs,
  },
  utilityBar: {
    height: 8,
    backgroundColor: colors.darkGray + '20',
    borderRadius: 4,
    marginBottom: sizes.xs,
  },
  utilityProgress: {
    height: 8,
    backgroundColor: colors.black,
    borderRadius: 4,
  },
  utilityText: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
  },
  improvementList: {
    backgroundColor: colors.darkGray + '10',
    padding: sizes.md,
    borderRadius: 6,
  },
  improvementListTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
    marginBottom: sizes.sm,
  },
  improvementListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.xs,
  },
  improvementItemText: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    marginLeft: sizes.xs,
  }
});

export default RoundPerfTab;
