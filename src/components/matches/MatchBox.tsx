import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Card, Icon } from '@components/common';

export interface MatchBoxProps {
  mapName: string;
  mapImage: string;
  agentName: string;
  agentImage: string;
  gameMode: string;
  result: 'win' | 'loss' | 'draw';
  score: string; // e.g., "13-11"
  kills: number;
  deaths: number;
  assists: number;
  date: string;
  isPremium?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const getResultColor = (result: 'win' | 'loss' | 'draw') => {
  switch (result) {
    case 'win':
      return colors.success;
    case 'loss':
      return colors.error;
    case 'draw':
      return colors.warning;
  }
};

export const MatchBox: React.FC<MatchBoxProps> = React.memo(({
  mapName,
  mapImage,
  agentName,
  agentImage,
  gameMode,
  result,
  score,
  kills,
  deaths,
  assists,
  date,
  isPremium = false,
  onPress,
  style,
}) => {
  const resultColor = useMemo(() => getResultColor(result), [result]);
  const resultText = useMemo(() => result.toUpperCase(), [result]);
  
  const accessibilityLabel = useMemo(
    () => `${result} on ${mapName}, ${gameMode}. Score: ${score}. Played as ${agentName}. ${kills} kills, ${deaths} deaths, ${assists} assists. ${date}${isPremium ? ', Premium locked' : ''}`,
    [result, mapName, gameMode, score, agentName, kills, deaths, assists, date, isPremium]
  );

  return (
    <Card
      elevation="sm"
      pressable={!!onPress}
      onPress={onPress}
      style={style}
      contentStyle={styles.content}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={onPress ? "Double tap to view match details" : undefined}
    >
      {isPremium && (
        <View 
          style={styles.premiumBadge}
          accessibilityLabel="Premium content"
          accessible={true}
        >
          <Icon name="lock" size="xs" color={colors.white} />
        </View>
      )}

      <View 
        style={[styles.resultBar, { backgroundColor: resultColor }]}
        accessible={true}
        accessibilityLabel={`Match result: ${result}`}
      />

      <View style={styles.container}>
        {/* Left: Map Image */}
        <View style={styles.mapContainer}>
          <Image
            source={{ uri: mapImage }}
            style={styles.mapImage}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel={`${mapName} map`}
          />
        </View>

        {/* Center: Match Info */}
        <View style={styles.matchInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.mapName}>{mapName}</Text>
            <Text style={[styles.resultText, { color: resultColor }]}>
              {resultText}
            </Text>
          </View>

          <Text style={styles.gameMode}>{gameMode}</Text>

          <View style={styles.statsRow}>
            <View style={styles.agentContainer}>
              <Image
                source={{ uri: agentImage }}
                style={styles.agentImage}
                resizeMode="cover"
              />
              <Text style={styles.agentName}>{agentName}</Text>
            </View>

            <View style={styles.kdaContainer}>
              <Text style={styles.kda}>
                <Text style={styles.kdaValue}>{kills}</Text>
                {' / '}
                <Text style={[styles.kdaValue, { color: colors.error }]}>{deaths}</Text>
                {' / '}
                <Text style={styles.kdaValue}>{assists}</Text>
              </Text>
              <Text style={styles.kdaLabel}>K / D / A</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.score}>{score}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
});

MatchBox.displayName = 'MatchBox';

const styles = StyleSheet.create({
  content: {
    padding: 0,
  },
  premiumBadge: {
    position: 'absolute',
    top: sizes.sm,
    right: sizes.sm,
    backgroundColor: colors.premium,
    borderRadius: sizes.borderRadius.full,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  resultBar: {
    height: 4,
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    padding: sizes.md,
  },
  mapContainer: {
    width: 80,
    height: 80,
    borderRadius: sizes.borderRadius.md,
    overflow: 'hidden',
    marginRight: sizes.md,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  matchInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.xs,
  },
  mapName: {
    ...fonts.styles.h6,
    color: colors.textPrimary,
  },
  resultText: {
    ...fonts.styles.caption,
    fontWeight: fonts.weights.bold,
    letterSpacing: fonts.letterSpacing.wide,
  },
  gameMode: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginBottom: sizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  agentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  agentImage: {
    width: 24,
    height: 24,
    borderRadius: sizes.borderRadius.sm,
    marginRight: sizes.xs,
  },
  agentName: {
    ...fonts.styles.caption,
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },
  kdaContainer: {
    alignItems: 'flex-end',
  },
  kda: {
    ...fonts.styles.body,
  },
  kdaValue: {
    color: colors.textPrimary,
    fontWeight: fonts.weights.medium,
  },
  kdaLabel: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  score: {
    ...fonts.styles.body,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
  },
  date: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
  },
});

export default MatchBox;
