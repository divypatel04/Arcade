import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MapStatsType } from '../types/MapStatsType';
import { useTranslation } from 'react-i18next';
import { getSupabaseImageUrl } from '../utils';

interface MapBoxProps {
  bestMap: MapStatsType | null;
}

const MapBox = ({bestMap}:MapBoxProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const mapName = bestMap?.map?.name ?? 'Map';
  const mapImage = bestMap?.map?.image ? getSupabaseImageUrl(bestMap.map.image) : '';

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('MapListScreen')}
      activeOpacity={0.6}
      style={styles.mapcontainer}>
      <View style={styles.mapimagecontainer}>
        <Image
          source={{ uri: mapImage }}
          defaultSource={require('../assets/images/raze.png')}
          resizeMode="cover"
          style={styles.mapimage}
        />
      </View>
      <View style={styles.mapmeta}>
        <Text style={styles.mapsubtext}>{t('home.bestMap')}</Text>
        <Text
          style={styles.mapname}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          {mapName}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  mapcontainer: {
    width: '48%',
    aspectRatio: 1 / 1,
    backgroundColor: colors.primary,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  mapimagecontainer: {
    width: '100%',
    height: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
  },
  mapimage: {
    width: '80%',
    marginBottom: 0,
    marginLeft: -sizes['11xl'],
    height: '80%',
    resizeMode: 'contain',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: sizes['6xl'],
    top: 0,
    opacity: 0.4,
    backgroundColor: colors.primary,
  },
  mapmeta: {
    paddingRight: sizes['5xl'],
    paddingBottom: sizes.xl,
    alignItems: 'flex-end',
  },
  mapsubtext: {
    paddingTop: sizes.sm,
    fontFamily: fonts.family.proximaSemiBold,
    fontSize: fonts.sizes.md + 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  mapname: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['12xl'],
    lineHeight: fonts.sizes['11xl'],
    letterSpacing: -0.4,
    color: colors.black,
    textTransform: 'lowercase',
  },
});


export default MapBox