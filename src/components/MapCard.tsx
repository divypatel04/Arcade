import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from './lcon'
import { colors, fonts } from '../theme'

interface MapBoxProps {
  isPremium: boolean;
  item: {
    map: any;
    seasonName: string;
    value: string;
  };
  onPress: () => void;
}

const MapCard = ({isPremium,item, onPress}: MapBoxProps) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={styles.mapbox}>
        <Image style={styles.mapimage} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a'}} />
        <View style={styles.mapmetacontainer}>
          <View style={{flexDirection:'row'}}>
            <View style={styles.meta}>
              <Text style={styles.metatitle}>Ascent</Text>
              <Text style={styles.metasubtext}>Morocco</Text>
            </View>
            <View style={{justifyContent: 'center',}}>
              <Text>Lock</Text>
            </View>
          </View>
          <View style={styles.rightmeta}>
            <Text style={styles.rightmetatext}>
              Matches- {item.value}
            </Text>
            <Icon name="arrow-right-s-line" size={22} color={colors.darkGray} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  mapbox: {
    backgroundColor: colors.primary,
    marginBottom: 12,
    padding: 10,
    flexDirection: 'row',
    zIndex: 1,
  },
  mapimage: {
    width: '22%',
    aspectRatio: 1 / 1,
    borderRadius: 3,
    resizeMode: 'contain',
  },
  mapmetacontainer: {
    flexDirection: 'row',
    // width: '78%',
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

export default MapCard