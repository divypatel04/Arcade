import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import { SeasonStatsType } from '../types/SeasonStatsType';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type SeasonBoxProps = {
  season: SeasonStatsType;
}

const SeasonBox = ({season}: SeasonBoxProps) => {

  const { t } = useTranslation();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const ranks = [
    {
      id: 0,
      name: 'UNRANKED',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png',
    },
    {
      id: 1,
      name: 'Unused1',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png',
    },
    {
      id: 2,
      name: 'Unused2',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png',
    },
    {
      id: 3,
      name: 'Iron 1',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/3/largeicon.png',
    },
    {
      id: 4,
      name: 'Iron 2',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/4/largeicon.png',
    },
    {
      id: 5,
      name: 'Iron 3',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/5/largeicon.png',
    },
    {
      id: 6,
      name: 'Bronze 1',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/6/largeicon.png',
    },
    {
      id: 7,
      name: 'Bronze 2',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/7/largeicon.png',
    },
    {
      id: 8,
      name: 'Bronze 3',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/8/largeicon.png',
    },
    {
      id: 9,
      name: 'Silver 1',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/9/largeicon.png',
    },
    {
      id: 10,
      name: 'Silver 2',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/10/largeicon.png',
    },
    {
      id: 11,
      name: 'Silver 3',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/11/largeicon.png',
    },
    {
      id: 12,
      name: 'Gold 1',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/12/largeicon.png',
    },
    {
      id: 13,
      name: 'Gold 2',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/13/largeicon.png',
    },
    {
      id: 14,
      name: 'Gold 3',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/14/largeicon.png',
    },
    {
      id: 15,
      name: 'Platinum 1',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/15/largeicon.png',
    },
    {
      id: 16,
      name: 'Platinum 2',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/16/largeicon.png',
    },
    {
      id: 17,
      name: 'Platinum 3',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/17/largeicon.png',
    },
    {
      id: 18,
      name: 'Diamond 1',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png',
    },

    {
      id: 19,
      name: 'Diamond 2',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/largeicon.png',
    },
    {
      id: 20,
      name: 'Diamond 3',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/20/largeicon.png',
    },
    {
      id: 21,
      name: 'Ascendant 1',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/21/largeicon.png',
    },
    {
      id: 22,
      name: 'Ascendant 2',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/22/largeicon.png',
    },
    {
      id: 23,
      name: 'Ascendant 3',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/23/largeicon.png',
    },
    {
      id: 24,
      name: 'Immortal 1',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/24/largeicon.png',
    },
    {
      id: 25,
      name: 'Immortal 2',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/25/largeicon.png',
    },
    {
      id: 26,
      name: 'Immortal 3',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/26/largeicon.png',
    },
    {
      id: 27,
      name: 'Radiant',
      largeicon:
        'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/27/largeicon.png',
    },
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.statscontainer} onPress={() => navigation.navigate('SeasonInfoScreen')}
    >
      <View style={styles.rankdetails}>
        <Image
          style={styles.rankimage}
          source={{ uri: ranks.find(rank => rank.id === season.stats.highestRank)?.largeicon || ranks[0].largeicon }}
        />
        <View style={styles.rankmeta}>
          <Text style={styles.rankepisode}>{t('home.currentSeason')}</Text>
          <Text style={styles.ranktitle}>
            {ranks.find(rank => rank.id === season.stats.highestRank)?.name || ranks[0].name}
          </Text>
        </View>
      </View>

      <View style={styles.statsdetails}>
        <View>
          <Text style={styles.stattitle}>{season.stats.matchesWon}</Text>
          <Text style={styles.statsubtext}>{t('common.wins')}</Text>
        </View>
        <View>
          <Text style={styles.stattitle}>{season.stats.matchesLost}</Text>
          <Text style={styles.statsubtext}>{t('common.lose')}</Text>
        </View>
        <View>
          <Text style={styles.stattitle}>
            {season.stats.kills}
          </Text>
          <Text style={styles.statsubtext}>{t('common.kills')}</Text>
        </View>
        <View>
          <Text style={styles.stattitle}>{season.stats.mvps}</Text>
          <Text style={styles.statsubtext}>{t('common.MVPS')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  statscontainer: {
    backgroundColor: colors.primary,
    padding: sizes['4xl'],
  },
  rankdetails: {
    paddingHorizontal: 3,
    flexDirection: 'row',
    paddingTop: sizes.md,
  },
  rankimage: {
    width: '12%',
    aspectRatio: 1 / 1,
    resizeMode: 'center',
    marginHorizontal: sizes.md,
  },
  rankmeta: {
    width: '82%',
    justifyContent: 'center',
    paddingLeft: sizes.sm,
  },
  ranktitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    lineHeight: fonts.sizes['5xl'],
    letterSpacing: -0.1,
    textTransform: 'lowercase',
    color: colors.black,
    textAlignVertical: 'center',
  },
  rankepisode: {
    fontFamily: fonts.family.proximaSemiBold,
    fontSize: fonts.sizes.md,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  statsdetails: {
    paddingVertical: sizes['5xl'],
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stattitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['8xl'],
    textTransform: 'uppercase',
    color: colors.black,
    textAlign: 'center',
  },
  statsubtext: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.lg,
    textTransform: 'uppercase',
    color: colors.darkGray,
    paddingTop: sizes.sm,
    textAlign: 'center',
  },
});

export default SeasonBox