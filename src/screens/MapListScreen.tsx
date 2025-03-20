import React, { useEffect, useState } from 'react'
import { colors, fonts, sizes } from '../theme';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDown from '../components/DropDown';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import MapCard from '../components/MapCard';
import PremiumModal from '../components/PremiumModal';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MapStatsType } from '../types/MapStatsType';
import { getAllMapSeasonNames, isPremiumUser, sortMapsByMatches } from '../utils';
import { useDataContext } from '../context/DataContext';
import { useTranslation } from 'react-i18next';

interface MapListProps {
  mapStat: MapStatsType,
  seasonName: string,
  numberOfMatches: number
}

const MapListScreen = () => {
  const {t} = useTranslation();
  const {mapStats, userData} = useDataContext();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const seasonNames = getAllMapSeasonNames(mapStats);
  const [selectedSeason, setSelectedSeason] = useState(seasonNames[1]);
  const [mapList,setMapList] = useState<MapListProps[]>();
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [selectedPremiumMap, setSelectedPremiumMap] = useState<MapStatsType | null>(null);

  useEffect(() => {
    const maplist = sortMapsByMatches(mapStats, selectedSeason);
    setMapList(maplist);
  }, [selectedSeason]);

  const handleMapPress = (map: MapStatsType) => {
    if (map.isPremiumStats && !isPremiumUser(userData)) {
      // Only show modal if user is not premium and trying to access premium content
      setSelectedPremiumMap(map);
      setPremiumModalVisible(true);
    } else {
      // Either not premium content or user is a premium user, navigate directly
      navigation.navigate('MapInfoScreen', { map: map, seasonName: selectedSeason });
    }
  };

  const handleWatchAd = () => {
    // TODO: Implement ad watching functionality
    setPremiumModalVisible(false);
    if (selectedPremiumMap) {
      navigation.navigate('MapInfoScreen', { map: selectedPremiumMap, seasonName: selectedSeason });
    }
  };

  const handleBuyPremium = () => {
    // TODO: Navigate to premium purchase screen
    setPremiumModalVisible(false);
    navigation.navigate('PremiumSubscription'); // Assuming this screen exists
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
        <View style={styles.dropdowncontainer}>
          <DropDown
            list={seasonNames}
            name={t('common.season')}
            value={selectedSeason}
            onSelect={item => setSelectedSeason(item)}
          />
        </View>
      </View>

      <FlatList
        data={mapList}
        renderItem={({ item }) => (
          <MapCard
            isPremium={item.mapStat.isPremiumStats ?? false}
            item={item}
            onPress={() => handleMapPress(item.mapStat)}
          />
        )}
        // keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
      />

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
});

export default MapListScreen