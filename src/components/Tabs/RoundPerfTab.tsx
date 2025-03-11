import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import { Icon } from '../lcon';
import { RoundPerformance } from '../../types/MatchStatType';


interface RoundPerfTabProps {
  roundStats: RoundPerformance[];
}

const RoundPerfTab = ({roundStats}:RoundPerfTabProps) => {
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const screenWidth = Dimensions.get('window').width;

  // Helper function for impact score color
  const getImpactScoreColor = (score: number) => {
    if (score >= 80) return colors.win;
    if (score >= 50) return "#FFA500"; // Orange
    return colors.lose;
  };

  // Get the selected round data
  const selectedRoundData = selectedRound
    ? roundStats.find(round => round.roundNumber === selectedRound)
    : null;

  return (
    <View style={styles.container}>
      {/* Round timeline */}
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>ROUND TIMELINE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineScroll}>
          {roundStats.map((round) => (
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
                  <Text style={styles.statLabel}>KILLS</Text>
                  <Text style={styles.statValue}>
                    {selectedRoundData.combat.kills}
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

              <View style={styles.divider} />

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

    marginTop: sizes.lg,
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

    marginBottom: sizes.lg,
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
    padding: sizes.md,
    marginTop: sizes.lg,
  },
  sectionTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.lg,
    letterSpacing: 0.2,
    color: colors.black,
    marginBottom: sizes.lg,
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
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  economyValue: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
  },
  combatContainer: {
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
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
  },
  combatValue: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
  },
});

export default RoundPerfTab;
