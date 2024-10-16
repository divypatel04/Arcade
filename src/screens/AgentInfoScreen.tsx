import React, { useState } from 'react'
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DropDown from '../components/DropDown'
import { colors, fonts, sizes } from '../theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

const AgentInfoScreen = () => {

  const ses = ['seso11', 'seso11', 'seso11', 'seso11', 'seso11'];
  const [selectedAct, setSelectedAct] = useState(ses[0]);

  return (
   <View style={styles.container}>
    <View style={styles.details}>
      <View style={styles.imagecontainer}>
          <ImageBackground
            style={styles.image}
            source={require('../assets/images/raze.png')}
          />
      </View>
      <View style={styles.meta}>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome
            name="angles-left"
            color={colors.darkGray}
            size={20}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <View style={{marginTop:'auto'}}>
        <Text style={styles.subtext}>Agent</Text>
        <Text style={styles.title}>Raze</Text>
        <View style={styles.dropdowncontainer}>
          <DropDown
            list={ses}
            name="Act"
            value={selectedAct}
            onSelect={item => setSelectedAct(item)}
          />
        </View>
        </View>
      </View>

    </View>
   </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: 0,
    flex: 1,
    backgroundColor: colors.white,
  },
  details: {
    flexDirection:'row',
    height: 260,
  },
  meta: {
    paddingTop: 15,
  },
  backicon: {
    paddingTop: sizes.md,
    paddingBottom: sizes.md,
  },
  title: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 50,
    color: colors.black,
    letterSpacing: -0.9,
    paddingBottom: 5,
    textTransform: 'capitalize',

  },
  subtext: {
    fontFamily: fonts.family.proximaBold,
    fontSize: 13,
    paddingTop: 5,
    marginBottom: -3,
    lineHeight: 13,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  dropdowncontainer: {
    flexDirection: 'row',
    marginTop: sizes['4xl'],
    alignItems: 'center',
    paddingBottom: sizes.md,
  },
  imagecontainer: {
    width: '60%',
    // alignSelf: 'flex-end',
    position: 'absolute',
    right: 0,
    marginRight:-20,
  },
  image: {
    width: '100%',
    height: 260,
    resizeMode: 'contain',
  },
});

export default AgentInfoScreen