import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import StatsSummary from '../StatsSummary'
import DetailedStats from '../DetailedStats'
import { colors, fonts, sizes } from '../../theme';
import { WeaponSeasonPerformance, WeaponStatsType } from '../../types/WeaponStatsType';
import { useTranslation } from 'react-i18next';


interface HitStats {
  stats: WeaponSeasonPerformance | undefined
}

const HitsTab = ({stats}:HitStats) => {

  const {t} = useTranslation();

  const calculatePercentage = (value: number) =>
    stats ? (value / (stats.stats.headshots + stats.stats.bodyshots + stats.stats.legshots)) * 100 : 0;
  const headshotPer = stats ? parseFloat(
    calculatePercentage(stats.stats.headshots).toFixed(1),
  ) : 0;
  const bodyshotPer = stats ? parseFloat(
    calculatePercentage(stats.stats.bodyshots).toFixed(1),
  ) : 0;
  const legshotPer = stats ? parseFloat(calculatePercentage(stats.stats.legshots).toFixed(1)) : 0;

  return (
    <View
      // showsVerticalScrollIndicator={false}
      style={styles.tabContainer}>
      <View style={styles.container}>
        <View style={styles.bodyHitBox}>
          <View style={styles.bodyImageContainer}>
            <View>
              <Image
                style={styles.bodyImage}
                source={require('../../assets/images/body1.png')}
              />
              <Image
                style={[
                  styles.bodyImage,
                  styles.redOverlay,
                  {
                    opacity: headshotPer / 100,
                  },
                ]}
                source={require('../../assets/images/body1.png')}
              />
            </View>
            <View>
              <Image
                style={styles.bodyImage}
                source={require('../../assets/images/body2.png')}
              />
              <Image
                style={[
                  styles.bodyImage,
                  styles.redOverlay,
                  {
                    opacity: bodyshotPer / 100,
                  },
                ]}
                source={require('../../assets/images/body2.png')}
              />
            </View>
            <View>
              <Image
                style={styles.bodyImage}
                source={require('../../assets/images/body3.png')}
              />
              <Image
                style={[
                  styles.bodyImage,
                  styles.redOverlay,
                  {
                    opacity: legshotPer / 100,
                  },
                ]}
                source={require('../../assets/images/body3.png')}
              />
            </View>
          </View>
          <View style={styles.shotsMeta}>
            {stats && [
              {
                value: stats.stats.headshots,
                title: t('common.headshots'),
                percentage: headshotPer,
              },
              {
                value: stats.stats.bodyshots,
                title: t('common.bodyshots'),
                percentage: bodyshotPer,
              },
              {
                value: stats.stats.legshots,
                title: t('common.legshots'),
                percentage: legshotPer,
              },
            ].map((shot, index) => (
              <View key={index} style={styles.singleShot}>
                <Text style={styles.shotCount}>{shot.value + ''}</Text>
                <Text style={styles.shotTitle}>{shot.title}</Text>
                <Text style={styles.shotValue}>{`(${shot.percentage.toFixed(
                  2,
                )}%)`}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes['3xl'],
    flex:1,
  },
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes['8xl'],
    paddingVertical: sizes['6xl'],
    marginBottom: sizes['3xl'],
  },
  bodyHitBox: {
    flexDirection: 'row',
    marginTop: - sizes['6xl'],
  },
  bodyImageContainer: {
    width: '30%',
    gap: sizes.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyImage: {
    width: sizes['18xl'] + 2,
    height: sizes['18xl'] + 2,
  },
  redOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    tintColor: colors.lose,
    resizeMode: 'cover',
    backgroundColor: 'transparent',
    zIndex: 1,
    width: sizes['18xl'] + 2,
    height: sizes['18xl'] + 2,
  },
  shotsMeta: {
    gap: sizes['5xl'],
    paddingTop: sizes['13xl'],
  },
  singleShot: {
    flexDirection: 'row',
    gap: sizes.sm,
  },
  shotCount: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    lineHeight: fonts.sizes['4xl'],
    textTransform: 'uppercase',
    color: colors.black,
    minWidth: sizes['14xl'],
  },
  shotTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['3xl'],
    lineHeight: fonts.sizes['3xl'],
    textTransform: 'lowercase',
    color: colors.darkGray,
  },
  shotValue: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    paddingTop: sizes.sm,
    paddingBottom: sizes.xs,
    lineHeight: fonts.sizes.md,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
});

export default HitsTab