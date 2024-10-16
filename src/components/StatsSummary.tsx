import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, sizes } from '../theme';


//TODO: Add Stats Type
const StatsSummary = ({ stats }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        {stats != undefined &&
          stats.map((item: any, index: number) => {
            return (
              <View key={index} style={styles.stat}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  style={styles.stattitle}>
                  {item?.value ? item?.value : 0}
                </Text>
                <Text style={styles.statsubtext}>
                  {item?.name ? item?.name : 'NA'}
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes['3xl'],
    paddingVertical: sizes.sm,
    marginBottom: sizes['3xl'],
  },
  stats: {
    marginVertical: sizes['8xl'],
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    width: '33%',
  },
  stattitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['3xl'],
    lineHeight: fonts.sizes['5xl'],
    color: colors.black,
    textAlign: 'center',
  },
  statsubtext: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    textTransform: 'uppercase',
    color: colors.darkGray,
    paddingTop: sizes.sm,
    textAlign: 'center',
  },
});

export default StatsSummary;
