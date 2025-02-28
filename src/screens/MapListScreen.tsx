import React, { useEffect, useState } from 'react'
import { colors, fonts, sizes } from '../theme';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDown from '../components/DropDown';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import MapCard from '../components/MapCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MapStats } from '../data/dummyData';
import { MapStatsType } from '../types/MapStatsType';
import { getAllMapSeasonNames, sortMapsByMatches } from '../utils';


interface MapListProps {
  mapStat: MapStatsType,
  seasonName: string,
  numberOfMatches: number
}

const MapListScreen = () => {

  const navigation = useNavigation<StackNavigationProp<any>>();

  const seasonNames = getAllMapSeasonNames(MapStats);
  const [selectedSeason, setSelectedSeason] = useState(seasonNames[1]);
  const [mapList,setMapList] = useState<MapListProps[]>();

  useEffect(() => {
      const maplist = sortMapsByMatches(MapStats, selectedSeason);
      setMapList(maplist);
    }, [selectedSeason]);

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
        <Text style={styles.headertitle}>Maps</Text>
        <View style={styles.dropdowncontainer}>
          <DropDown
            list={seasonNames}
            name="Act"
            value={selectedSeason}
            onSelect={item => setSelectedSeason(item)}
          />
        </View>
      </View>

      <FlatList
        data={mapList}
        renderItem={({ item }) => (
          <MapCard
            isPremium={true}
            item={item}
            onPress={() => {
              navigation.navigate('MapInfoScreen', { map: item.mapStat, seasonName: selectedSeason });
            }}
          />
        )}
        // keyExtractor={item => item}
        showsVerticalScrollIndicator={false}
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