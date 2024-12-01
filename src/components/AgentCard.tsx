import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from './lcon';
import { colors, fonts, sizes } from '../theme';


interface AgentBoxProps {
  isPremium: boolean,
  item: {
    agent: any, //TODO: change agent type
    seasonName: string,
    value: string,
  },
  onPress: () => void;
}

//TODO: Add Premium Icon here
const AgentCard = ({ isPremium, item, onPress }: AgentBoxProps) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={styles.card}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fraze_icon.jpg?alt=media&token=1552f893-d7da-455b-99f1-4d3a5b2ef524' }}
        />
        <View style={styles.metacontainer}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.meta}>
              <Text style={styles.metatitle}>Raze</Text>
              <Text style={styles.metasubtext}>Duelist</Text>
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
    paddingVertical: sizes.xl,
    paddingHorizontal: sizes.xl,
    flexDirection: 'row',
    zIndex: 1,
    flex: 1,
  },
  icon: {
    width: '18%',
    aspectRatio: 1 / 1,
    borderRadius: 3,
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
    lineHeight: fonts.sizes.lg,
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

export default AgentCard