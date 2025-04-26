import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '@theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { getAllWeaponSeasonNames, isPremiumUser, sortWeaponsByMatches } from '@utils';
import { WeaponStatsType } from '@types';
import { useDataContext } from '@context';
import { useTranslation } from 'react-i18next';
import { DropDown, GunCard, PremiumModal } from '@components';

type WeaponListProps = {
  weapon: WeaponStatsType,
  seasonName: string,
  numberOfKills: number
}

const WeaponListScreen = () => {
  const {t} = useTranslation();
  const {userData, weaponStats} = useDataContext();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const seasonNames = getAllWeaponSeasonNames(weaponStats);
  const [selectedSeason, setSelectedSeason] = useState(seasonNames[1]);
  const [weaponList,setWeaponList] = useState<WeaponListProps[]>();
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [selectedPremiumWeapon, setSelectedPremiumWeapon] = useState<WeaponStatsType | null>(null);

  useEffect(() => {
    const weaponlist = sortWeaponsByMatches(weaponStats, selectedSeason);
    setWeaponList(weaponlist);
  }, [selectedSeason]);

  const handleWeaponPress = (weapon: WeaponStatsType) => {
    if (weapon.isPremiumStats && !isPremiumUser(userData)) {
      setSelectedPremiumWeapon(weapon);
      setPremiumModalVisible(true);
    } else {
      navigation.navigate('WeaponInfoScreen', { weapon: weapon, seasonName: selectedSeason });
    }
  };

  const handleWatchAd = () => {
    setPremiumModalVisible(false);
    if (selectedPremiumWeapon) {
      navigation.navigate('WeaponInfoScreen', { weapon: selectedPremiumWeapon, seasonName: selectedSeason });
    }
  };
  const handleBuyPremium = () => {
    setPremiumModalVisible(false);
    navigation.navigate('PremiumSubscriptionScreen'); // Assuming this screen exists
  };

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
        <Text style={styles.headertitle}>{t('listScreen.weapons')}</Text>
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
        data={weaponList}
        renderItem={({ item }) => (
          <GunCard
            isPremium={item.weapon.isPremiumStats ?? false}
            item={item}
            onPress={() => handleWeaponPress(item.weapon)}
          />
        )}
        keyExtractor={(item) => item.weapon.id}
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

export default WeaponListScreen