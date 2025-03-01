import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import DropDown from '../components/DropDown';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import GunCard from '../components/GunCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { weaponStats } from '../data/dummyData';
import { getAllWeaponSeasonNames, sortWeaponsByMatches } from '../utils';
import { WeaponStatType } from '../types/WeaponStatsType';


type WeaponListProps = {
  weapon: WeaponStatType,
  seasonName: string,
  numberOfKills: number
}

const WeaponListScreen = () => {

  const navigation = useNavigation<StackNavigationProp<any>>();

  const seasonNames = getAllWeaponSeasonNames(weaponStats);
  const [selectedSeason, setSelectedSeason] = useState(seasonNames[1]);
  const [weaponList,setWeaponList] = useState<WeaponListProps[]>();

  useEffect(() => {
    const weaponlist = sortWeaponsByMatches(weaponStats, selectedSeason);
    setWeaponList(weaponlist);
  }, [selectedSeason]);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.goBack()}>
          <FontAwesome
            name="angles-left"
            color={colors.darkGray}
            size={20}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <Text style={styles.headertitle}>Weapons</Text>
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
        data={weaponList}
        renderItem={({ item }) => (
          <GunCard
            isPremium={true}
            item={item}
            onPress={() => {
              navigation.navigate('WeaponInfoScreen', { weapon: item.weapon, seasonName: selectedSeason });
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

export default WeaponListScreen