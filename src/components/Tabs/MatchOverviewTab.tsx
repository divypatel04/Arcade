import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import { convertMillisToReadableTime } from '../../utils';
import StatsSummary from '../StatsSummary';
import DetailedStats from '../DetailedStats';

const MatchOverviewTab = () => {

  const firstStatBoxData = [
    {name: 'Kills', value: '25'},
    {name: 'Deaths', value: '10'},
    {
      name: 'K/D',
      value: '2.5',
    },
  ];

  const statBoxTwoData = [
    {
      name: 'Avg.Damage',
      value: '150',
    },
    {name: 'Aces', value: '1'},
    {name: 'PlayTime', value: convertMillisToReadableTime(1500000)},
    {name: 'First Blood', value: '2'},
    {name: 'Plants', value: '3'},
    {name: 'Defuse', value: '1'},
  ];


  return (
    <View
      // showsVerticalScrollIndicator={false}
      style={styles.tabContainer}>

        <View style={styles.scoreContainer}>
          <Image
            style={styles.scoreImage}
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agent%2Fsova.webp?alt=media&token=c87d1ec4-bb3f-46f4-b552-a8b54eed257c',
            }}
          />
          <View style={styles.scoreMeta}>
            <Text style={styles.scoreSubText}>
              Victory
            </Text>
            <Text
              style={[
                styles.scorePrimaryText,
                {color: true ? colors.win : colors.lose},
              ]}>
                13-9
            </Text>

          <View style={styles.scoreStats}>
            <Text style={styles.scoreStat}>05/02/2025</Text>
            <Text style={styles.scoreStat}>Ranked</Text>
            <Text style={[styles.scoreStat, {color: colors.black}]}>
              Map - Ascent
            </Text>
          </View>
        </View>
      </View>

      <StatsSummary stats={firstStatBoxData} />
      <DetailedStats stats={statBoxTwoData} />
    </View>
  )
};


const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes['3xl'],
    flex:1,
  },
  scoreContainer: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingLeft: 20,
    marginTop: 30,
    marginBottom: 15,
    position: 'relative',
  },
  scoreMeta: {
    zIndex: 1,
  },
  scoreSubText: {
    paddingTop: 4,
    fontFamily: fonts.family.proximaBold,
    fontSize: 14,
    letterSpacing: -0.3,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  scorePrimaryText: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 46,
    lineHeight: 46,
    textTransform: 'uppercase',
    color: colors.win,
  },
  scoreStats: {
    paddingTop: 24,
    paddingBottom: 20,
  },
  scoreStat: {
    color: colors.darkGray,
    fontFamily: fonts.family.proximaBold,
    fontSize: 10,
    letterSpacing: 0.4,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  scoreImage: {
    width: '45%',
    height: 210,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
});

export default MatchOverviewTab