import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '@theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { getAllSeasonNames, isPremiumUser, sortWeaponsByMatches } from '@utils';
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

  // Check if weaponStats is empty or undefined
  const hasWeaponStats = weaponStats && weaponStats.length > 0;

  // Only get season names if we have weapon stats
  const seasonNames = hasWeaponStats ? getAllSeasonNames(weaponStats) : [''];
  const [selectedSeason, setSelectedSeason] = useState(hasWeaponStats ? seasonNames[1] : '');
  const [weaponList,setWeaponList] = useState<WeaponListProps[]>();
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [selectedPremiumWeapon, setSelectedPremiumWeapon] = useState<WeaponStatsType | null>(null);

  useEffect(() => {
    if (hasWeaponStats) {
      const weaponlist = sortWeaponsByMatches(weaponStats, selectedSeason);
      setWeaponList(weaponlist);
    }
  }, [selectedSeason, hasWeaponStats]);

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
        {hasWeaponStats && (
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

      {hasWeaponStats ? (
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
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="gun"
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
    color: colors.black,
    marginBottom: sizes.xl,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  emptyMessage: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.xl,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: fonts.sizes['4xl'],
  },
});

export default WeaponListScreen