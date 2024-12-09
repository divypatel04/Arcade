import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from './lcon';
import { colors, fonts, sizes } from '../theme';


interface GunBoxProps {
  isPremium: boolean,
  item: {
    gun: any, //TODO: Change Gun Types
    seasonName: string,
    value: string,
  },
  onPress: () => void;
}

//TODO: ADD Premium icon
const GunCard = ({ isPremium, item, onPress }: GunBoxProps) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={styles.card}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fvandal.png?alt=media&token=858dd763-6723-4f37-8f5b-3c9b57125bd6' }}
        />
        <View style={styles.metacontainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.meta}>
              <Text style={styles.metatitle}>Vandal</Text>
              <Text style={styles.metasubtext}>Primary</Text>
            </View>
            {isPremium && (
              <View style={{ justifyContent: 'center', }}>
                <Icon
                  name={'star-fill'}
                  size={15}
                  color={colors.darkGray}
                />
              </View>
            )}
          </View>
          <View style={styles.rightmeta}>
            <Text style={styles.rightmetatext}>
              Matches: {item.value}
            </Text>
            <Icon name="arrow-right-s-line" size={22} color={colors.darkGray} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: colors.primary,
    marginBottom: sizes['2xl'],
    paddingVertical: sizes['4xl'],
    paddingRight: sizes['2xl'],
    paddingLeft: sizes.sm,
    flexDirection: 'row',
    zIndex: 1,
    flex: 1,
  },
  icon: {
    width: '25%',
    aspectRatio: 16 / 9,
    borderRadius: 3,
    marginHorizontal: sizes.xs,
    resizeMode: 'contain',
  },
  metacontainer: {
    flexDirection: 'row',
    flex: 1,
  },
  meta: {
    paddingLeft: sizes.xl,
    justifyContent: 'center',
  },
  metatitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['5xl'],
    lineHeight: fonts.sizes['7xl'],
    letterSpacing: -0.3,
    color: colors.black,
    paddingRight: sizes.xl,
  },
  metasubtext: {
    fontFamily: fonts.family.proximaBold,
    letterSpacing: 0.3,
    fontSize: fonts.sizes.md,
    lineHeight: fonts.sizes.md,
    color: colors.darkGray,
  },
  rightmeta: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightmetatext: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    marginBottom: -2,
    textTransform: 'uppercase',
    color: colors.darkGray,
    paddingRight: sizes.xl,
  },
});

export default GunCard