import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';

const GunBox = () => {
  return (
    <TouchableOpacity
      // onPress={() => navigation.navigate('WeaponListScreen')}
      activeOpacity={0.6}
      style={styles.weaponcontainer}>
      <View style={styles.weaponimagecontainer}>
        <Image
          source={{ uri: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fvandal.png?alt=media&token=858dd763-6723-4f37-8f5b-3c9b57125bd6" }}
          resizeMode="contain"
          style={styles.weaponimage}
        />
      </View>
      <View style={styles.weaponmeta}>
        <Text style={styles.weaponsubtext}>Best Gun</Text>
        <Text
          style={styles.weaponname}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          Vandal
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
    fontSize: fonts.sizes['11xl'] + 2,
    lineHeight: fonts.sizes['11xl'] + 2,
    letterSpacing: -0.8,
    color: colors.black,
    textTransform: 'capitalize',
  },
});


export default GunBox