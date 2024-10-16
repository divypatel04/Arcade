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


const AgentCard = ({isPremium, item, onPress}: AgentBoxProps) => {
  return (
    <View key={item.seasonName}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={styles.agentcard}>
        <Image
          style={styles.agentimage}
          source={{uri: 'https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/agentIcon%2Fraze_icon.jpg?alt=media&token=1552f893-d7da-455b-99f1-4d3a5b2ef524'}}
        />
        <View style={styles.metacontainer}>
          <View style={{flexDirection:'row'}}>
            <View style={styles.meta}>
              <Text style={styles.metatitle}>Raze</Text>
              <Text style={styles.metasubtext}>Duelist</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    zIndex: 1,
    flex:1,
  },
  agentimage: {
    width: '18%',
    aspectRatio: 1 / 1,
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
    fontSize: 12,
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

export default AgentCard