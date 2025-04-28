import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, fonts } from '../theme';
import { Icon } from './lcon';
import { MatchStatsType } from '../types/MatchStatsType';
import { getSupabaseImageUrl } from '../utils';

interface MatchBoxProps {
  isPremium: boolean;
  match: MatchStatsType;
  onPress: () => void;
}

const MatchBox = ({ isPremium, match, onPress }: MatchBoxProps) => {
  const isWon = match.stats.general.winningTeam === match.stats.playerVsplayerStat.user.teamId;

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={styles.matchBox}>
      <Image
        style={styles.matchAgentImage}
        source={{ uri: getSupabaseImageUrl(match.stats.general.agent.icon) }}
      />
      <View style={styles.matchMetaContainer}>
        <View style={styles.matchMeta}>
          <Text>
            <Text
              style={[
                styles.matchMetaTitle,
                { color: isWon ? colors.win : colors.lose },
              ]}>
              {isWon ? 'Victory' : 'Defeat'}
            </Text>{' '}
            <Text style={styles.matchMetaScore}>
              {match.stats.playerVsplayerStat.user.stats.roundsWon}-
              {match.stats.playerVsplayerStat.user.stats.roundsPlayed - match.stats.playerVsplayerStat.user.stats.roundsWon}
            </Text>
          </Text>
          <Text style={styles.matchMetaSubText}>
            {match.stats.playerVsplayerStat.user.stats.kills}/{match.stats.playerVsplayerStat.user.stats.deaths}/{match.stats.playerVsplayerStat.user.stats.assists} -{' '}
            {match.stats.general.map.name} - {match.stats.general.queueId}
          </Text>
        </View>


        <View style={styles.rightMeta}>
          <View style={{ flexDirection: 'row' }}>
            {isPremium && (
              <View style={{ justifyContent: 'center' }}>
                <Icon
                  name={'star-fill'}
                  size={15}
                  color={colors.darkGray}
                  style={{ marginTop: -2, marginRight: 5 }}
                />
              </View>
            )}
            <Icon name="arrow-right-s-line" size={20} color={colors.darkGray} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  matchBox: {
    backgroundColor: colors.primary,
    marginBottom: 12,
    padding: 10,
    flexDirection: 'row',
    zIndex: 1,
  },
  matchAgentImage: {
    width: '17%',
    aspectRatio: 1 / 1,
    borderRadius: 3,
    resizeMode: 'contain',
  },
  matchMetaContainer: {
    flexDirection: 'row',
    width: '83%',
  },
  matchMeta: {
    paddingLeft: 11,
    justifyContent: 'center',
  },
  matchMetaTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.win,
    paddingRight: 10,
    textTransform: 'lowercase',
  },
  matchMetaScore: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: colors.black,
    textTransform: 'lowercase',
  },
  matchMetaSubText: {
    fontFamily: fonts.family.proximaBold,
    letterSpacing: 0.3,
    fontSize: 12,
    color: colors.darkGray,
  },
  rightMeta: {
    marginLeft: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default MatchBox;
