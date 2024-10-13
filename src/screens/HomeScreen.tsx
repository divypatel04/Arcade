import { Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const HomeScreen = () => {
  return (
    <View>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'#feac4577'}
      />

      {/* AGENT BOX */}
      <View style={styles.agentcontainer}>
        <ImageBackground source={{uri: 'https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/background.png'}} style={styles.agentbackgroudimage}>
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
        </View>
      </View>

      {/* GUN BOX */}
      <View style={styles.guncontainer}>
        <View style={styles.gunmetacontainer}>
          <Text style={styles.gunsubtext}>Best Agent</Text>
          <Text
            style={styles.gunname}
            numberOfLines={1}
            adjustsFontSizeToFit={true}>
            Raze
          </Text>
        </View>
        <View>
          <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/weapon%2Fvandal.png?alt=media&token=858dd763-6723-4f37-8f5b-3c9b57125bd6"}} style={styles.gunimage}/>
        </View>
      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  // AGENT BOX
  agentcontainer: {
    backgroundColor: '#feac4577',
    height:330,
  },
  agentimage:{
    height:330,
    aspectRatio: 7.6/9,
    resizeMode: 'contain',
    alignSelf:'flex-end',
    position: 'absolute',
  },
  agentbackgroundimage:{
    height:350,
    width:130,
    resizeMode: 'contain',
    alignSelf:'flex-end',
    position: 'absolute',
    opacity: 0.6,
  },
  agentmetacontainer:{
    paddingTop: 60,
    paddingLeft: 24,
  },
  agentmetadetails: {
    paddingBottom:4,
    flexDirection:'row',
  },
  agentmetatitle: {
    fontFamily: 'ProximaNova-Bold',
    color: '#000',
  },
  agentmetavalue: {
    paddingLeft:4,
    fontFamily: 'ProximaNova-Bold',
    color: '#686B71',
  },
  agentbutton:{
    marginTop:20,
    alignItems: 'flex-start',
    marginLeft: -24,
  },
  agentbuttontext: {
    fontFamily: 'ProximaNova-Semibold',
    fontSize: 13,
    letterSpacing:0.3,
    textTransform:'uppercase',
    backgroundColor: '#fff',
    padding:10,
  },
  agentsubtext: {
    paddingTop: 6,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#686B71',
  },
  agentname: {
    fontFamily: 'Novecentosansnarrow-UltraBold',
    fontSize: 58,
    lineHeight: 58,
    letterSpacing: -0.8,
    color: '#000',
    marginBottom:20,
  },

  // MAP BOX
  mapsubtext: {
    paddingTop: 6,
    fontFamily: 'ProximaNova-Semibold',
    fontSize: 16,
    textTransform: 'uppercase',
    color: '#686B71',
  },
  mapname: {
    fontFamily: 'Novecentosansnarrow-UltraBold',
    fontSize: 50,
    lineHeight: 50,
    letterSpacing: -0.8,
    color: '#000',
    marginBottom:20,
  },
  mapcontainer: {
    backgroundColor: '#C28E7B80',
    height: 180,
    borderTopColor:"#000",
    borderTopWidth:1,
    flexDirection:'row',
  },
  mapimage:{
    height:180,
    width:150,
    marginLeft:25,
    resizeMode: 'center',

  },
  mapmetacontainer:{
    paddingRight: 24,
    alignItems:'flex-end',
    flex: 1,
    alignSelf:'flex-end',
  },

  // GUN BOX
  guncontainer: {
    backgroundColor: '#C28E7B80',
    height: 180,
    borderTopColor:"#000",
    borderTopWidth:1,
    flexDirection:'row',
  },
  gunmetacontainer: {
    paddingLeft: 24,

    // flex: 1,
    // alignItems:'flex-end',
    alignSelf:'flex-end',
  },
  gunimage: {
    height:180,
    position:'absolute',
    left: 0,
    width:220,
    resizeMode: 'center',
  }
});

export default HomeScreen