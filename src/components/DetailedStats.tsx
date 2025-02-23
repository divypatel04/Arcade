import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { colors, fonts, sizes } from '../theme';

interface Stat {
  name: string;
  value: string | number | undefined;
}

interface StatBoxTwoProps {
  stats: Stat[];
}

const DetailedStats: React.FC<StatBoxTwoProps> = ({stats}) => {
  const renderStat = (stat: Stat) => (
    <View style={styles.stat}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        style={styles.stattitle}>
        {stat?.value ? stat?.value : 0}
      </Text>
      <Text style={styles.statsubtext}>{stat?.name ? stat?.name : 'NA'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {stats.length > 0 && (
        <View style={styles.statsrow}>
          {stats.slice(0, 3).map((stat, index) => (
            <React.Fragment key={index}>
              {stat && renderStat(stat)}
            </React.Fragment>
          ))}
        </View>
      )}
      {stats.length > 3 && (
        <View style={styles.statsrow}>
          {stats.slice(3).map((stat, index) => (
            <React.Fragment key={index + 3}>
              {stat && renderStat(stat)}
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes['4xl'],
    paddingVertical: sizes['11xl'],
    marginBottom: sizes['3xl'],
    gap: 25,
  },
  statsrow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    width: '33%',
  },
  stattitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    lineHeight: fonts.sizes['7xl'],
    textTransform:'uppercase',
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

export default DetailedStats;
