import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from './lcon'
import { colors, fonts, sizes } from '../theme'
import { MapStatsType } from '../types/MapStatsType';
import { useTranslation } from 'react-i18next';
import { getSupabaseImageUrl } from '../utils';

interface MapBoxProps {
  isPremium: boolean;
  item: {
    mapStat: MapStatsType;
    seasonName: string;
    numberOfMatches: number;
  };
  onPress: () => void;
}

//TODO: Add Premium Icon here
const MapCard = ({ isPremium, item, onPress }: MapBoxProps) => {
  const {t} = useTranslation();
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={styles.card}>
        <Image style={styles.icon} source={{ uri: getSupabaseImageUrl(item.mapStat.map.image) }} />
        <View style={styles.metacontainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.meta}>
              <Text style={styles.metatitle}>{item.mapStat.map.name}</Text>
              <Text style={styles.metasubtext}>{item.mapStat.map.location}</Text>
            </View>
            {isPremium && (
              <View style={{ justifyContent: 'center', }}>
                <Icon
                  name={'star-fill'}
                  size={15}
                  color={colors.darkGray}
                />
              </View>
            )}
          </View>
          <View style={styles.rightmeta}>
            <Text style={styles.rightmetatext}>
              {t('common.matches')}- {item.numberOfMatches}
            </Text>
            <Icon name="arrow-right-s-line" size={22} color={colors.darkGray} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    marginBottom: sizes['2xl'],
    paddingVertical: sizes.xl,
    paddingHorizontal: sizes.xl,
    flexDirection: 'row',
    zIndex: 1,
    flex: 1,
  },
  icon: {
    width: '22%',
    aspectRatio: 1 / 1,
    borderRadius: 3,
    resizeMode: 'contain',
  },
  metacontainer: {
    flexDirection: 'row',
    flex: 1,
  },
  meta: {
    paddingLeft: sizes.xl,
    justifyContent: 'center',
  },
  metatitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['6xl'],
    lineHeight: fonts.sizes['8xl'],
    letterSpacing: -0.3,
    color: colors.black,
    paddingRight: sizes.xl,
    paddingBottom: sizes.xs,
    textTransform: 'lowercase',
  },
  metasubtext: {
    fontFamily: fonts.family.proximaBold,
    letterSpacing: 0.3,
    fontSize: fonts.sizes.md,
    lineHeight: fonts.sizes.md,
    color: colors.darkGray,
  },
  rightmeta: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightmetatext: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    marginBottom: -2,
    textTransform: 'uppercase',
    color: colors.darkGray,
    paddingRight: sizes.xl,
  },
});

export default MapCard