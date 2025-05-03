import React, { useEffect, useState } from 'react'
import { colors, fonts, sizes } from '@theme';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MapStatsType } from '@types';
import { getAllSeasonNames, isPremiumUser, sortMapsByMatches } from '@utils';
import { useDataContext } from '@context';
import { useTranslation } from 'react-i18next';
import { DropDown, PremiumModal, MapCard } from '@components';

interface MapListProps {
  mapStat: MapStatsType,
  seasonName: string,
  numberOfMatches: number
}

const MapListScreen = () => {
  const {t} = useTranslation();
  const {mapStats, userData} = useDataContext();
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Check if mapStats is empty or undefined
  const hasMapStats = mapStats && mapStats.length > 0;

  // Only get season names if we have map stats
  const seasonNames = hasMapStats ? getAllSeasonNames(mapStats) : [''];
  const [selectedSeason, setSelectedSeason] = useState(hasMapStats ? seasonNames[1] : '');
  const [mapList,setMapList] = useState<MapListProps[]>();
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [selectedPremiumMap, setSelectedPremiumMap] = useState<MapStatsType | null>(null);

  useEffect(() => {
    if (hasMapStats) {
      const maplist = sortMapsByMatches(mapStats, selectedSeason);
      setMapList(maplist);
    }
  }, [selectedSeason, hasMapStats]);

  const handleMapPress = (map: MapStatsType) => {
    if (map.isPremiumStats && !isPremiumUser(userData)) {
      setSelectedPremiumMap(map);
      setPremiumModalVisible(true);
    } else {
      navigation.navigate('MapInfoScreen', { map: map, seasonName: selectedSeason });
    }
  };
  const handleWatchAd = () => {
    setPremiumModalVisible(false);
    if (selectedPremiumMap) {
      navigation.navigate('MapInfoScreen', { map: selectedPremiumMap, seasonName: selectedSeason });
    }
  };
  const handleBuyPremium = () => {
    setPremiumModalVisible(false);
    navigation.navigate('PremiumSubscriptionScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome
            name="angles-left"
            color={colors.darkGray}
            size={18}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <Text style={styles.headertitle}>{t('listScreen.maps')}</Text>
        {hasMapStats && (
          <View style={styles.dropdowncontainer}>
            <DropDown
              list={seasonNames}
              name={t('common.season')}
              value={selectedSeason}
              onSelect={item => setSelectedSeason(item)}
            />
          </View>
        )}
      </View>

      {hasMapStats ? (
        <FlatList
          data={mapList}
          renderItem={({ item }) => (
            <MapCard
              isPremium={item.mapStat.isPremiumStats ?? false}
              item={item}
              onPress={() => handleMapPress(item.mapStat)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="map-location-dot"
            color={colors.darkGray}
            size={64}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>{t('common.noDataAvailable')}</Text>
          <Text style={styles.emptyMessage}>
            {t('common.noMatchesPlayed')}
          </Text>
        </View>
      )}

      <PremiumModal
        visible={premiumModalVisible}
        onClose={() => setPremiumModalVisible(false)}
        onWatchAd={handleWatchAd}
        onBuyPremium={handleBuyPremium}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: sizes.xl,
    backgroundColor: colors.white,
  },
  header: {
    paddingVertical: sizes.xl,
  },
  headertitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['13xl'],
    color: colors.black,
    letterSpacing: -0.7,
  },
  dropdowncontainer: {
    flexDirection: 'row',
    marginTop: sizes['4xl'],
    alignItems: 'center',
    paddingBottom: sizes.md,
  },
  backicon: {
    paddingTop: sizes.md,
    paddingBottom: sizes.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sizes['6xl'],
  },
  emptyIcon: {
    marginBottom: sizes['4xl'],
    opacity: 0.6,
  },
  emptyTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    textTransform: 'lowercase',
    color: colors.black,
    marginBottom: sizes.xl,
    textAlign: 'center',
  },
  emptyMessage: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.xl,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: fonts.sizes['4xl'],
  },
});

export default MapListScreen