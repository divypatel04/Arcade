import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';

const MapBox = () => {
  return (
    <TouchableOpacity
      // onPress={() => navigation.navigate('MapListScreen')}
      activeOpacity={0.6}
      style={styles.mapcontainer}>
      <View style={styles.mapimagecontainer}>
        <Image
          source={{ uri: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a" }}
          resizeMode="cover"
          style={styles.mapimage}
        />
      </View>
      <View style={styles.mapmeta}>
        <Text style={styles.mapsubtext}>Best Map</Text>
        <Text
          style={styles.mapname}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          Ascent
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  mapcontainer: {
    width: '48%',
    aspectRatio: 1 / 1,
    backgroundColor: colors.primary,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  mapimagecontainer: {
    width: '100%',
    height: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
  },
  mapimage: {
    width: '80%',
    marginBottom: 0,
    marginLeft: -sizes['11xl'],
    height: '80%',
    resizeMode: 'contain',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: sizes['6xl'],
    top: 0,
    opacity: 0.4,
    backgroundColor: colors.primary,
  },
  mapmeta: {
    paddingRight: sizes['5xl'],
    paddingBottom: sizes.xl,
    alignItems: 'flex-end',
  },
  mapsubtext: {
    paddingTop: sizes.sm,
    fontFamily: fonts.family.proximaSemiBold,
    fontSize: fonts.sizes.md + 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  mapname: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['11xl'] + 2,
    lineHeight: fonts.sizes['11xl'] + 2,
    letterSpacing: -0.8,
    color: colors.black,
    textTransform: 'capitalize',
  },
});


export default MapBox