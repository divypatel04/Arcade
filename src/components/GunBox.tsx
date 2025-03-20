import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { WeaponStatType } from '../types/WeaponStatsType';
import { useTranslation } from 'react-i18next';
import { getSupabaseImageUrl } from '../utils';

type GunBoxProps = {
  bestWeapon: WeaponStatType;
}

const GunBox = ({bestWeapon}:GunBoxProps) => {
  const { t } = useTranslation();

  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('WeaponListScreen')}
      activeOpacity={0.6}
      style={styles.weaponcontainer}>
      <View style={styles.weaponimagecontainer}>
        <Image
          source={{ uri: getSupabaseImageUrl(bestWeapon.weapon.image) }}
          resizeMode="contain"
          style={styles.weaponimage}
        />
      </View>
      <View style={styles.weaponmeta}>
        <Text style={styles.weaponsubtext}>{t('home.bestWeapon')}</Text>
        <Text
          style={styles.weaponname}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          {bestWeapon.weapon.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  weaponcontainer: {
    width: '48%',
    aspectRatio: 1 / 1,
    backgroundColor: colors.primary,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  weaponimagecontainer: {
    width: '100%',
    height: '53%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weaponimage: {
    width: '85%',
    marginTop: sizes.xl,
    height: '85%',
  },
  weaponmeta: {
    paddingRight: sizes['5xl'],
    paddingBottom: sizes.xl,
    alignItems: 'flex-end',
  },
  weaponsubtext: {
    paddingTop: sizes.sm,
    fontFamily: fonts.family.proximaSemiBold,
    fontSize: fonts.sizes.md + 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  weaponname: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['12xl'],
    lineHeight: fonts.sizes['11xl'],
    letterSpacing: -0.4,
    color: colors.black,
    textTransform: 'lowercase',
  },
});


export default GunBox