import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import StatsSummary from '../StatsSummary'
import DetailedStats from '../DetailedStats'
import { colors, fonts } from '../../theme';
import { SeasonPerformance, WeaponStatType } from '../../types/WeaponStatsType';


interface HitStats {
  stats: SeasonPerformance | undefined
}

const HitsTab = ({stats}:HitStats) => {

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
                title: 'Headshots',
                percentage: headshotPer,
              },
              {
                value: stats.stats.bodyshots,
                title: 'Bodyshots',
                percentage: bodyshotPer,
              },
              {
                value: stats.stats.legshots,
                title: 'Legshots',
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
    paddingTop: 8,
    flex:1,
  },
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 20,
    marginBottom: 14,
  },
  bodyHitBox: {
    flexDirection: 'row',
    marginTop: -20,
  },
  bodyImageContainer: {
    width: '30%',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyImage: {
    width: 50,
    height: 50,
  },
  redOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    tintColor: colors.lose,
    resizeMode: 'cover',
    backgroundColor: 'transparent',
    zIndex: 1,
    width: 50,
    height: 50,
  },
  shotsMeta: {
    gap: 22,
    paddingTop: 34,
  },
  singleShot: {
    flexDirection: 'row',
    gap: 5,
  },
  shotCount: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 28,
    lineHeight: 22,
    // paddingTop: 5,
    // paddingBottom: 3,
    textTransform: 'uppercase',
    color: colors.black,

    minWidth: 35,
  },
  shotTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 20,
    // paddingTop: 5,
    lineHeight: 20,
    textTransform: 'lowercase',
    color: colors.darkGray,
  },
  shotValue: {
    fontFamily: fonts.family.proximaBold,
    fontSize: 12,
    paddingTop: 5,
    paddingBottom: 3,
    lineHeight: 13,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
});

export default HitsTab