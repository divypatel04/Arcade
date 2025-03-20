import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts, sizes } from '../../theme';
import { useTranslation } from 'react-i18next';
import { getSupabaseImageUrl } from '../../utils';

interface mapListType {
  id: string;
  image: string;
  name: string;
  location: string;
  wins: number;
  losses: number;
}

interface BestMapType {
  mapList: mapListType[] | undefined
}

const BestMapTab = ({mapList}:BestMapType) => {
  const {t} = useTranslation();
  const calculateWinRate = (item: mapListType) => {
    const winRate = ((item.wins / (item.wins + item.losses)) * 100).toFixed(2);
    return `${t('common.winRate')}- ${winRate}%`;
  };

  const renderMapBox = (item: mapListType) => (
    <View key={item.id}>
      <TouchableOpacity activeOpacity={0.5} style={styles.mapBox}>
        <Image style={styles.mapImage} source={{uri: getSupabaseImageUrl(item.image)}} />
        <View style={styles.metaContainer}>
          <View style={styles.mapMeta}>
            <Text style={styles.metaTitle}>{item.name}</Text>
            <Text style={styles.metaSubTitle}>
              {t('common.wins')}: {item.wins} | {t('common.losses')}: {item.losses}
            </Text>
          </View>
          <View style={styles.rightMeta}>
            <Text style={styles.rightText}>{calculateWinRate(item)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const sortedMapData = mapList ? [...mapList].sort((a, b) => {
    const winRateA = a.wins / (a.wins + a.losses);
    const winRateB = b.wins / (b.wins + b.losses);
    return winRateB - winRateA;
  }) : [];

  return (
    <View style={styles.tabContainer}>
      <ScrollView style={styles.mapLists} showsVerticalScrollIndicator={false}>
        {sortedMapData.map(item => renderMapBox(item))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingTop: sizes['3xl'],
    flex:1,
  },
  mapLists: {
    paddingTop: sizes['4xl'],
    marginBottom: sizes['19xl'],
  },
  mapBox: {
    backgroundColor: colors.primary,
    marginBottom: sizes['2xl'],
    padding: sizes.xl,
    flexDirection: 'row',
    zIndex: 1,
  },
  mapImage: {
    width: '22%',
    aspectRatio: 1 / 1,
    borderRadius: 3,
    resizeMode: 'contain',
  },
  metaContainer: {
    flexDirection: 'row',
    width: '78%',
  },
  mapMeta: {
    paddingLeft: sizes.xl,
    justifyContent: 'center',
  },
  metaTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['6xl'],
    lineHeight: fonts.sizes['7xl'],
    letterSpacing: -0.3,
    color: colors.black,
    paddingRight: sizes.xl,
    paddingBottom: sizes.sm,
    textTransform: 'lowercase',
  },
  metaSubTitle: {
    fontFamily: fonts.family.proximaBold,
    letterSpacing: 0.3,
    fontSize: fonts.sizes.md,
    lineHeight: fonts.sizes.lg,
    color: colors.darkGray,
  },
  rightMeta: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    marginBottom: -2,
    textTransform: 'uppercase',
    color: colors.darkGray,
    paddingRight: sizes.xl,
  },
});

export default BestMapTab;