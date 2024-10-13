import { Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors, fonts, fontSizes, sizes } from '../theme';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'#feac4577'}
      />

      {/* AGENT BOX */}
      <View style={styles.agentcontainer}>
        <ImageBackground source={{uri: 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/background.png'}} style={styles.agentbackgroundimage}>
        </ImageBackground>
        <ImageBackground source={require('../assets/images/raze.png')} style={styles.agentimage}>
        </ImageBackground>
        <View style={styles.agentmetacontainer}>
          <Text style={styles.agentsubtext}>Best Agent</Text>
          <Text
            style={styles.agentname}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            Raze
          </Text>
          <View style={styles.agentmetadetails}>
            <Text style={styles.agentmetatitle}>Matches Played:</Text><Text style={styles.agentmetavalue}>60</Text>
          </View>
          <View style={styles.agentmetadetails}>
            <Text style={styles.agentmetatitle}>Kills:</Text><Text style={styles.agentmetavalue}>379</Text>
          </View>

          <TouchableOpacity style={styles.agentbutton}>
            <Text style={styles.agentbuttontext}>{'<<'} All Agents</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* MAP BOX */}
      <View style={styles.mapcontainer}>
        <View>
          <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a"}} style={styles.mapimage}/>
        </View>
        <View style={styles.mapmetacontainer}>
          <Text style={styles.mapsubtext}>Best Map</Text>
          <Text
            style={styles.mapname}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            Ascent
          </Text>
          <View style={styles.mapmetadetails}>
            <Text style={styles.agentmetatitle}>Win/Rate:</Text><Text style={styles.agentmetavalue}>60%</Text>
          </View>
        </View>
      </View>

      {/* GUN BOX */}
      <View style={styles.guncontainer}>
        <View style={styles.gunmetacontainer}>
          <Text style={styles.gunsubtext}>Best Gun</Text>
          <Text
            style={styles.gunname}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            Vandal
          </Text>
          <View style={styles.gunmetadetails}>
            <Text style={styles.agentmetatitle}>Total Kills:</Text><Text style={styles.agentmetavalue}>1076</Text>
          </View>
        </View>
        <View style={styles.gunimagecontainer}>
          <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fvandal.png?alt=media&token=858dd763-6723-4f37-8f5b-3c9b57125bd6"}} style={styles.gunimage}/>
        </View>
      </View>


    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: sizes.marginExtraLarge,
  },
  agentcontainer: {
    backgroundColor: colors.primary,
    flex: 3,
  },
  agentimage: {
    height: '100%',
    aspectRatio: 7.6 / 9,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    position: 'absolute',
  },
  agentbackgroundimage: {
    height: '100%',
    width: 130,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    position: 'absolute',
    opacity: 0.6,
  },
  agentmetacontainer: {
    paddingTop: sizes.paddingLarge,
    paddingLeft: sizes.paddingLarge,
  },
  agentmetadetails: {
    paddingBottom: sizes.marginSmall,
    flexDirection: 'row',
  },
  agentmetatitle: {
    fontFamily: fonts.proximaNovaBold,
    color: colors.textPrimary,
  },
  agentmetavalue: {
    paddingLeft: sizes.marginSmall,
    fontFamily: fonts.proximaNovaBold,
    color: colors.textSecondary,
  },
  agentbutton: {
    marginTop: sizes.marginMedium,
    alignItems: 'flex-start',
    marginLeft: -sizes.marginLarge,
  },
  agentbuttontext: {
    fontFamily: fonts.proximaNovaSemibold,
    fontSize: fontSizes.small,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    backgroundColor: colors.background,
    padding: sizes.paddingSmall,
  },
  agentsubtext: {
    paddingTop: sizes.marginSmall,
    fontFamily: fonts.proximaNovaSemibold,
    fontSize: fontSizes.medium,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  agentname: {
    fontFamily: fonts.novecentosansUltraBold,
    fontSize: fontSizes.extraLarge,
    lineHeight: fontSizes.extraLarge,
    letterSpacing: -0.8,
    color: colors.textPrimary,
    marginBottom: sizes.marginMedium,
  },
  mapsubtext: {
    paddingTop: sizes.marginSmall,
    fontFamily: fonts.proximaNovaSemibold,
    fontSize: fontSizes.medium,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  mapname: {
    fontFamily: fonts.novecentosansUltraBold,
    fontSize: fontSizes.large,
    lineHeight: fontSizes.large,
    letterSpacing: -0.8,
    color: colors.textPrimary,
    marginBottom: sizes.marginMedium,
  },
  mapcontainer: {
    backgroundColor: colors.secondary,
    height: 180,
    borderTopColor: colors.textPrimary,
    borderTopWidth: 1,
    flexDirection: 'row',
    flex: 1.7,
  },
  mapimage: {
    height: 180,
    width: 150,
    marginLeft: 25,
    resizeMode: 'center',
  },
  mapmetacontainer: {
    paddingRight: 30,
    paddingTop: sizes.paddingMedium,
    alignItems: 'flex-end',
    flex: 1,
  },
  mapmetadetails: {
    paddingBottom: sizes.marginSmall,
    flexDirection: 'row',
  },
  guncontainer: {
    backgroundColor: colors.accent,
    height: 180,
    borderTopColor: colors.textPrimary,
    borderTopWidth: 1,
    flexDirection: 'row',
    flex: 1.7,
  },
  gunmetacontainer: {
    paddingLeft: sizes.paddingLarge,
    paddingTop: sizes.paddingMedium,
  },
  gunimagecontainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  gunimage: {
    height: 180,
    width: 230,
    resizeMode: 'center',
  },
  gunsubtext: {
    paddingTop: sizes.marginSmall,
    fontFamily: fonts.proximaNovaSemibold,
    fontSize: fontSizes.medium,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  gunname: {
    fontFamily: fonts.novecentosansUltraBold,
    fontSize: fontSizes.large,
    lineHeight: fontSizes.large,
    letterSpacing: -0.8,
    color: colors.textPrimary,
    marginBottom: sizes.marginMedium,
  },
  gunmetadetails: {
    paddingBottom: sizes.marginSmall,
    flexDirection: 'row',
  },
});

export default HomeScreen