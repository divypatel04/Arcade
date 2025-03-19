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

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.statscontainer} onPress={() => navigation.navigate('Act')}
    >
      <View style={styles.rankdetails}>
        <Image style={styles.rankimage} source={{ uri: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png' }} />
        <View style={styles.rankmeta}>
          <Text style={styles.rankepisode}>{t('home.currentSeason')}</Text>
          <Text style={styles.ranktitle}>Silver 3</Text>
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