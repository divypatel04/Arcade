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

  // Helper function for impact score color
  const getImpactScoreColor = (score: number) => {
    if (score >= 80) return colors.win;
    if (score >= 50) return "#FFA500"; // Orange
    return colors.lose;
  };

  // Get the selected round data
  const selectedRoundData = selectedRound
    ? roundPerformanceData.find(round => round.roundNumber === selectedRound)
    : null;

  return (
    <View style={styles.container}>
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

      {/* Round details - only show when a round is selected */}
      <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
        {!selectedRoundData && (
          <View style={styles.noSelectionContainer}>
            <Text style={styles.noSelectionText}>Select a round from the timeline to view details</Text>
          </View>
        )}

        {selectedRoundData && (
          <>
            <View style={styles.roundCard}>
              <View style={styles.roundHeaderRow}>
                <View style={styles.roundNumberDetails}>
                  <View style={styles.roundNumberBadge}>
                    <Text style={styles.roundNumberText}>Round {selectedRoundData.roundNumber}</Text>
                  </View>
                  <View style={styles.roundOutcome}>
                    <Text
                      style={[
                        styles.outcomeText,
                        { color: selectedRoundData.outcome === 'win' ? colors.win : colors.lose }
                      ]}
                    >
                      {selectedRoundData.outcome.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.impactScoreContainer}>
                  <Text
                    style={[
                      styles.impactScore,
                      { color: getImpactScoreColor(selectedRoundData.impactScore) }
                    ]}
                  >
                    {selectedRoundData.impactScore}
                  </Text>
                  <Text style={styles.impactLabel}>IMPACT</Text>
                </View>
              </View>
            </View>
            <View style={styles.divider} />
            {selectedRoundData.improvement.length > 0 && (
              <>
                <View style={styles.improvementList}>
                  <Text style={styles.improvementListTitle}>AREAS TO IMPROVE</Text>
                  {selectedRoundData.improvement.map((item, index) => (
                    <View key={index} style={styles.improvementListItem}>
                      <Icon name="checkbox-blank-circle-fill" size={6} color={colors.darkGray} />
                      <Text style={styles.improvementItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.divider} />
              </>
              )}

            <View style={styles.roundStatsContainer}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>K/D/A</Text>
                  <Text style={styles.statValue}>
                    {selectedRoundData.combat.kills}/{selectedRoundData.combat.deaths}/{selectedRoundData.combat.assists}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>DAMAGE</Text>
                  <Text style={styles.statValue}>{selectedRoundData.combat.damageDealt}</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>HS%</Text>
                  <Text style={styles.statValue}>{selectedRoundData.combat.headshotPercentage}%</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>LOADOUT</Text>
                  <Text style={styles.statValue}>{selectedRoundData.economy.weaponType}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.positioningContainer}>
                <View style={styles.sitePosition}>
                  <Text style={styles.siteLabel}>SITE:</Text>
                  <Text style={styles.siteValue}>{selectedRoundData.positioning.site}</Text>
                </View>

                <View style={styles.positionTags}>
                  <View
                    style={[
                      styles.positionTag,
                      { backgroundColor: selectedRoundData.positioning.firstContact ? colors.lose + '30' : colors.darkGray + '20' }
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: selectedRoundData.positioning.firstContact ? colors.lose : colors.darkGray }
                      ]}
                    >
                      {selectedRoundData.positioning.firstContact ? 'FIRST CONTACT' : 'SUPPORT'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.positionTag,
                      { backgroundColor: colors.darkGray + '20' }
                    ]}
                  >
                    <Text style={styles.tagText}>{selectedRoundData.positioning.positionType.toUpperCase()}</Text>
                  </View>
                </View>
              </View >

              <View style={styles.utilitySection}>
                <Text style={styles.utilityTitle}>UTILITY USAGE</Text>
                <View style={styles.utilityBar}>
                  <View
                    style={[
                      styles.utilityProgress,
                      { width: `${(selectedRoundData.utility.abilitiesUsed / selectedRoundData.utility.totalAbilities) * 100}%` }
                    ]}
                  />
                </View>
                <Text style={styles.utilityText}>
                  {selectedRoundData.utility.abilitiesUsed}/{selectedRoundData.utility.totalAbilities} abilities • {selectedRoundData.utility.utilityDamage} damage
                </Text>
              </View>



              {/* Additional economy details */}
              <View style={styles.economyContainer}>
                <Text style={styles.sectionTitle}>ECONOMY</Text>
                <View style={styles.economyDetails}>
                  <View style={styles.economyItem}>
                    <Text style={styles.economyLabel}>Armor</Text>
                    <Text style={styles.economyValue}>{selectedRoundData.economy.armorType}</Text>
                  </View>
                  <View style={styles.economyItem}>
                    <Text style={styles.economyLabel}>Credits Spent</Text>
                    <Text style={styles.economyValue}>{selectedRoundData.economy.creditSpent}</Text>
                  </View>
                  <View style={styles.economyItem}>
                    <Text style={styles.economyLabel}>Your Loadout</Text>
                    <Text style={styles.economyValue}>{selectedRoundData.economy.loadoutValue}</Text>
                  </View>
                  <View style={styles.economyItem}>
                    <Text style={styles.economyLabel}>Enemy Loadout</Text>
                    <Text style={styles.economyValue}>{selectedRoundData.economy.enemyLoadoutValue}</Text>
                  </View>
                </View>
              </View>

              {/* Combat specifics */}
              <View style={styles.combatContainer}>
                <Text style={styles.sectionTitle}>COMBAT DETAILS</Text>
                <View style={styles.combatDetails}>
                  <View style={styles.combatItem}>
                    <Text style={styles.combatLabel}>Trade Kill</Text>
                    <Text style={styles.combatValue}>{selectedRoundData.combat.tradeKill ? 'Yes' : 'No'}</Text>
                  </View>
                  <View style={styles.combatItem}>
                    <Text style={styles.combatLabel}>Death Traded</Text>
                    <Text style={styles.combatValue}>{selectedRoundData.combat.tradedKill ? 'Yes' : 'No'}</Text>
                  </View>
                  <View style={styles.combatItem}>
                    <Text style={styles.combatLabel}>Time to First Contact</Text>
                    <Text style={styles.combatValue}>{selectedRoundData.positioning.timeToFirstContact}s</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: sizes.xl,
  },
  timelineContainer: {
    marginHorizontal: sizes.md,
    marginBottom: sizes.md,
  },
  timelineTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.sm,
  },
  timelineScroll: {
    paddingBottom: sizes.sm,
  },
  timelineItem: {
    width: 50,
    height: 60,
    marginRight: sizes.md,
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
    fontSize: fonts.sizes.lg,
    color: colors.black,
  },
  impactIndicator: {
    position: 'absolute',
    bottom: -2,
    width: '100%',
    height: 3,
    borderRadius: 2,
  },
  detailsContainer: {
    flex: 1,
    marginTop: sizes.md,
    padding: sizes.lg,
    backgroundColor: colors.primary,

  },
  noSelectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sizes.xl * 2,
    paddingHorizontal: sizes.xl,
  },
  noSelectionText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    textAlign: 'center',
  },
  roundCard: {
    marginBottom: sizes.lg,
    overflow: 'hidden',
  },
  roundHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizes.lg,
    paddingBottom: sizes.md,
    // backgroundColor: colors.primary + '90',
  },
  roundNumberBadge: {
    justifyContent: 'center',
  },
  roundNumberText: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['2xl'],
    textTransform: 'lowercase',
    color: colors.black,
  },
  roundNumberDetails: {
    flex: 1,
  },
  roundOutcome: {
  },
  outcomeText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.lg,
    fontWeight: 'bold',
  },
  impactScoreContainer: {
    alignItems: 'flex-end',
  },
  impactScore: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    lineHeight: fonts.sizes['7xl'],
  },
  impactLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
  },
  roundStatsContainer: {

  },
  statRow: {
    padding: sizes.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: sizes.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  statValue: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['3xl'],
    color: colors.black,
    textTransform: 'lowercase'
  },
  positioningContainer: {
    padding: sizes.md,
    marginBottom: sizes.md,
  },
  sitePosition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  siteLabel: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginRight: sizes.xs,
  },
  siteValue: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.xl,
    lineHeight: fonts.sizes.lg,
    textTransform: 'lowercase',
    color: colors.black,
  },
  positionTags: {
    flexDirection: 'row',
  },
  positionTag: {
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    borderRadius: 4,
    marginRight: sizes.sm,
  },
  tagText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
  },
  utilitySection: {
    padding: sizes.md,
  },
  utilityTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.xs,
  },
  utilityBar: {
    height: 8,
    backgroundColor: colors.darkGray + '20',
    marginBottom: sizes.xs,
  },
  utilityProgress: {
    height: 8,
    backgroundColor: colors.darkGray,
  },
  utilityText: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  divider: {
    height: 1,
    backgroundColor: colors.darkGray + '20', // Adding transparency
    marginVertical: 2,
  },
  improvementList: {
    // backgroundColor: colors.darkGray + '10',
    marginTop:6,
    padding: sizes.md,
    borderRadius: 6,
    marginBottom: sizes.lg,

  },
  improvementListTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
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
  },
  economyContainer: {
    backgroundColor: colors.white + '40',
    padding: sizes.md,
    borderRadius: 6,
    marginBottom: sizes.lg,
  },
  sectionTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.black,
    marginBottom: sizes.md,
  },
  economyDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  economyItem: {
    width: '48%',
    marginBottom: sizes.md,
  },
  economyLabel: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
  },
  economyValue: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
  },
  combatContainer: {
    backgroundColor: colors.white + '40',
    padding: sizes.md,
    borderRadius: 6,
    marginBottom: sizes.lg,
  },
  combatDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  combatItem: {
    width: '48%',
    marginBottom: sizes.md,
  },
  combatLabel: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.xs,
    color: colors.darkGray,
  },
  combatValue: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
  },
});

export default RoundPerfTab;
