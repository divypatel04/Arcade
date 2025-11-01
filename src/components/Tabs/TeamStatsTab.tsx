import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import { Icon } from '../Icon';
import { useRoute } from '@react-navigation/native';
import { TeamStat } from '../../types/MatchStatsType';


interface TeamStatsProps {
  teamStats: TeamStat[];
  yourScore: number;
  enemyScore: number;
}

const TeamStatsTab = ({teamStats, yourScore, enemyScore}:TeamStatsProps) => {

  const yourTeam = teamStats[0];
  const enemyTeam = teamStats[1];

  const yourScoreColor = yourScore > enemyScore ? colors.win : yourScore < enemyScore ? colors.lose : colors.darkGray;
  const enemyScoreColor = enemyScore > yourScore ? colors.win : enemyScore < yourScore ? colors.lose : colors.darkGray;

  return (
    <View style={styles.tabContainer}>
      <View style={styles.scoreContainer}>
        <View style={styles.leftSide}>
          <Text style={[styles.scoreText, { color: yourScoreColor }]}>{yourScore}</Text>
          <Text style={styles.scoreSubText}>{yourTeam.team}</Text>
        </View>
        <View style={styles.centerSide}>
          <Text style={[styles.scoreSubText, styles.vsText]}>vs</Text>
        </View>
        <View style={styles.rightSide}>
          <Text style={[styles.scoreText, { color: enemyScoreColor }]}>{enemyScore}</Text>
          <Text style={styles.scoreSubText}>{enemyTeam.team}</Text>
        </View>
      </View>

      <View style={styles.scoreList}>
        <StatRow
          label="First Kills"
          leftValue={yourTeam.firstKills}
          rightValue={enemyTeam.firstKills}
          iconName="skull-line"
          compareValues={true}
        />

        <View style={styles.divider} />

        <StatRow
          label="Thrifties"
          leftValue={yourTeam.thrifties}
          rightValue={enemyTeam.thrifties}
          iconName="money-dollar-circle-line"
          compareValues={true}
        />

        <View style={styles.divider} />

        <StatRow
          label="Post Plants"
          leftValue={`${yourTeam.postPlantsWon} / ${yourTeam.postPlantsWon + yourTeam.postPlantsLost}`}
          rightValue={`${enemyTeam.postPlantsWon} / ${enemyTeam.postPlantsWon + enemyTeam.postPlantsLost}`}
          iconName="fire-line"
          compareValues={false}
          leftRatio={yourTeam.postPlantsWon / (yourTeam.postPlantsWon + yourTeam.postPlantsLost)}
          rightRatio={enemyTeam.postPlantsWon / (enemyTeam.postPlantsWon + enemyTeam.postPlantsLost)}
        />

        <View style={styles.divider} />

        <StatRow
          label="Clutches"
          leftValue={yourTeam.clutchesWon}
          rightValue={enemyTeam.clutchesWon}
          iconName="trophy-line"
          compareValues={true}
        />
      </View>
    </View>
  )
};

// Enhanced helper component for stat rows with icons and conditional coloring
interface StatRowProps {
  label: string;
  leftValue: number | string;
  rightValue: number | string;
  iconName?: string;
  compareValues?: boolean;
  leftRatio?: number;
  rightRatio?: number;
}

const StatRow: React.FC<StatRowProps> = ({
  label,
  leftValue,
  rightValue,
  iconName,
  compareValues = true,
  leftRatio,
  rightRatio
}) => {
  // For numeric comparisons
  let leftColor = colors.darkGray;
  let rightColor = colors.darkGray;

  if (compareValues) {
    if (Number(leftValue) > Number(rightValue)) {
      leftColor = colors.win;
      rightColor = colors.lose;
    } else if (Number(leftValue) < Number(rightValue)) {
      leftColor = colors.lose;
      rightColor = colors.win;
    }
  }

  // For ratio comparisons (post plants)
  if (leftRatio !== undefined && rightRatio !== undefined) {
    if (leftRatio > rightRatio) {
      leftColor = colors.win;
      rightColor = colors.lose;
    } else if (leftRatio < rightRatio) {
      leftColor = colors.lose;
      rightColor = colors.win;
    }
  }

  return (
    <View style={styles.stats}>
      <View style={styles.leftSide}>
        <Text style={[styles.statText, { color: leftColor }]}>{leftValue}</Text>
      </View>
      <View style={styles.centerSide}>
        <View style={styles.labelContainer}>
          {iconName && (
            <Icon
              name={iconName}
              size={18}
              color={colors.darkGray}
              style={styles.icon}
            />
          )}
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </View>
      <View style={styles.rightSide}>
        <Text style={[styles.statText, { color: rightColor }]}>{rightValue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes['5xl'],
    flex: 1,
  },
  scoreContainer: {
    backgroundColor: colors.primary,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreList: {
    backgroundColor: colors.primary,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  leftSide: {
    paddingLeft: 8,
    flex: 1,
  },
  rightSide: {
    alignItems: 'flex-end',
    paddingRight: 8,
    flex: 1,
  },
  centerSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  scoreText: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 38,
    lineHeight: 38,
    textTransform: 'uppercase',
    color: colors.black, // Default color, will be overridden by inline styles
    marginBottom: 4,
  },
  scoreSubText: {
    color: colors.darkGray,
    fontFamily: fonts.family.proximaBold,
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  vsText: {
    fontSize: 12,
  },
  statText: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 26,
    lineHeight: 28,
    color: colors.black, // Default color, will be overridden by inline styles
  },
  labelContainer: {
    flexDirection: 'row', // Changed to row to place icon beside text
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  statLabel: {
    color: colors.darkGray,
    fontFamily: fonts.family.proximaBold,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.darkGray + '20', // Adding transparency
    marginVertical: 2,
  }
});

export default TeamStatsTab