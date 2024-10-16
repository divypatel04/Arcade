import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';

const SeasonBox = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.statscontainer}
    >
      <View style={styles.rankdetails}>
        <Image style={styles.rankimage} source={{ uri: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png' }} />
        <View style={styles.rankmeta}>
          <Text style={styles.rankepisode}>Current Act</Text>
          <Text style={styles.ranktitle}>Silver 3</Text>
        </View>
      </View>

      <View style={styles.statsdetails}>
        <View>
          <Text style={styles.stattitle}>25</Text>
          <Text style={styles.statsubtext}>Wins</Text>
        </View>
        <View>
          <Text style={styles.stattitle}>18</Text>
          <Text style={styles.statsubtext}>Lose</Text>
        </View>
        <View>
          <Text style={styles.stattitle}>
            1.6
          </Text>
          <Text style={styles.statsubtext}>K/D</Text>
        </View>
        <View>
          <Text style={styles.stattitle}>160</Text>
          <Text style={styles.statsubtext}>Kills</Text>
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
    lineHeight: fonts.sizes['7xl'],
    letterSpacing: -0.3,
    textTransform: 'capitalize',
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
    fontSize: fonts.sizes['7xl'],
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