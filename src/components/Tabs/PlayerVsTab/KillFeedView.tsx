/**
 * Kill Feed View Component
 * Displays chronological kill feed between user and opponent
 */

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../../../theme';
import { Icon } from '../../Icon';
import { KillEvent } from '../../../types/MatchStatsType';

interface KillFeedViewProps {
  killFeed: KillEvent[];
  userName: string;
}

export const KillFeedView: React.FC<KillFeedViewProps> = ({ killFeed, userName }) => {
  // Render a kill feed entry
  const renderKillFeedItem = ({ item }: { item: KillEvent }) => {
    const isUserKiller = item.killer === userName;
    const isUserVictim = item.victim === userName;

    return (
      <View style={styles.killFeedItem}>
        <View style={styles.killFeedRound}>
          <Text style={styles.roundNumber}>{item.round}</Text>
        </View>

        <View style={styles.killFeedContent}>
          <Text
            style={[
              styles.killFeedPlayerName,
              isUserKiller ? styles.killFeedUserName : styles.killFeedEnemyName
            ]}
          >
            {item.killer}
          </Text>

          <View style={styles.killFeedWeaponContainer}>
            <Icon name="sword-line" size={14} color={colors.darkGray} />
            <Text style={styles.killFeedWeapon}>{item.weapon}</Text>
            {item.headshot && (
              <Icon
                name="skull-fill"
                size={14}
                color={colors.lose}
                style={styles.headshot}
              />
            )}
          </View>

          <Text
            style={[
              styles.killFeedPlayerName,
              isUserVictim ? styles.killFeedUserName : styles.killFeedEnemyName
            ]}
          >
            {item.victim}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.killFeedContainer}>
      <Text style={styles.sectionTitle}>KILL FEED</Text>
      <FlatList
        data={killFeed}
        renderItem={renderKillFeedItem}
        keyExtractor={(item, index) => `kill-${index}`}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  killFeedContainer: {
    backgroundColor: colors.primary,
    padding: sizes['2xl'],
    marginBottom: sizes.lg
  },
  sectionTitle: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.darkGray,
    marginBottom: sizes.xl
  },
  killFeedItem: {
    flexDirection: 'row',
    marginBottom: sizes.lg,
    alignItems: 'center'
  },
  killFeedRound: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sizes.md
  },
  roundNumber: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.md,
    color: colors.white
  },
  killFeedContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.darkGray + '10',
    padding: sizes.xl
  },
  killFeedPlayerName: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
    marginRight: sizes.sm
  },
  killFeedUserName: {
    color: colors.win
  },
  killFeedEnemyName: {
    color: colors.lose
  },
  killFeedWeaponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: sizes.md
  },
  killFeedWeapon: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    marginLeft: sizes.xs
  },
  headshot: {
    marginLeft: sizes.xs
  }
});
