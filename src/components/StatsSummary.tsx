import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, sizes } from '../theme';

interface Stat {
  value: number | string;
  name: string;
}

const StatsSummary = ({ stats }: { stats: Stat[] }) => {

  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        {stats != undefined &&
          stats.map((item: any, index: number) => {
            return (
              <View key={index} style={{width: `${100 / stats.length}%`}}>
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
    // width: `${100 / stats}%`,
  },
  stattitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    lineHeight: fonts.sizes['7xl'],
    // textTransform: 'uppercase',
    color: colors.black,
    textAlign: 'center',
  },
  statsubtext: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    textTransform: 'uppercase',
    color: colors.darkGray,
    paddingTop: sizes.sm,
    textAlign: 'center',
  },
});

export default StatsSummary;
