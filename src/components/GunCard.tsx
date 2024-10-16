import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from './lcon';
import { colors, fonts } from '../theme';


interface AgentBoxProps {
  isPremium: boolean,
  item: {
    agent: any,
    seasonName: string,
    value: string,
  },
  onPress: () => void;
}


const GunCard = ({isPremium, item, onPress}: AgentBoxProps) => {
  return (
    <View key={item.seasonName}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={styles.agentcard}>
        <Image
          style={styles.agentimage}
          source={{uri: 'https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fvandal.png?alt=media&token=858dd763-6723-4f37-8f5b-3c9b57125bd6'}}
        />
        <View style={styles.metacontainer}>
          <View style={{flexDirection:'row'}}>
            <View style={styles.meta}>
              <Text style={styles.metatitle}>Vandal</Text>
              <Text style={styles.metasubtext}>Primary</Text>
            </View>
            <View style={{justifyContent: 'center',}}>
              <Text>Lock</Text>
            </View>
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
  agentcard: {
    backgroundColor: colors.primary,
    marginBottom: 12,
    paddingVertical: 18,
    paddingRight: 12,
    paddingLeft:4,
    flexDirection: 'row',
    zIndex: 1,
    flex:1,
  },
  agentimage: {
    width: '25%',
    aspectRatio: 16 / 9,
    borderRadius: 3,
    resizeMode: 'contain',
  },
  metacontainer: {
    flexDirection: 'row',
    flex:1,
  },
  meta: {
    paddingLeft: 11,
    justifyContent: 'center',
  },
  metatitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: colors.black,
    paddingRight: 10,
  },
  metasubtext: {
    fontFamily: fonts.family.proximaBold,
    letterSpacing: 0.3,
    fontSize: 13,
    lineHeight: 13,
    color: colors.darkGray,
  },
  rightmeta: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightmetatext: {
    fontFamily: fonts.family.proximaBold,
    fontSize: 12,
    marginBottom: -2,
    textTransform: 'uppercase',
    color: colors.darkGray,
    paddingRight: 10,
  },
});

export default GunCard