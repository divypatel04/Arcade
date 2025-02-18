import React, { useState } from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DropDown from '../components/DropDown'
import { colors, fonts, sizes } from '../theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import AgentBox from '../components/AgentBox';
import TabBar from '../components/TabBar';
import OverviewTab from '../components/Tabs/OverviewTab';
import SiteTab from '../components/Tabs/SiteTab';
import BestMapTab from '../components/Tabs/BestMapTab';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const AgentInfoScreen = () => {

  const navigation = useNavigation<StackNavigationProp<any>>();

  const ses = ['seso11', 'seso11', 'seso11', 'seso11', 'seso11'];
  const [selectedAct, setSelectedAct] = useState(ses[0]);

  const firstStatBoxData = [
    { name: 'Matches', value: 50 },
    { name: 'Hours', value: '1h 54m' },
    { name: 'Win Rate', value: `45.9%` },
  ];

  const secondStatBoxData = [
    { name: 'Kills', value: 300 },
    { name: 'M.Wins', value: 30 },
    { name: 'M.Lose', value: 13 },
  ];

  const statBoxTwoData = [
    { name: 'K/D', value: 2.67 },
    { name: 'Damage/R', value: 156.78 },
    { name: 'Plants', value: 5 },
    { name: 'Aces', value: 2 },
    { name: 'First Blood', value: 38 },
    { name: 'Defuse', value: 2 },
  ];

  const mapList = [
    {
      mapName: "Ascent",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 15,
      mapLose: 8,
    },
    {
      mapName: "Bind",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 12,
      mapLose: 10,
    },
    {
      mapName: "Haven",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 20,
      mapLose: 5,
    },
    {
      mapName: "Split",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 7,
      mapLose: 14,
    },
    {
      mapName: "Icebox",
      mapImage: "https://firebasestorage.googleapis.com/v0/b/arcade-backend-100cd.appspot.com/o/map%2Fascent.png?alt=media&token=c466d351-e16e-4f00-bce7-44aa63d58c7a",
      mapWins: 11,
      mapLose: 9,
    }
  ];


  const tabs = [
    { label: 'Overview', content: <OverviewTab stats1={firstStatBoxData} stats2={secondStatBoxData} stats3={statBoxTwoData} /> },
    { label: 'On Attack', content: <SiteTab stats1={firstStatBoxData} roundwon={50} roundlose={100} /> },
    { label: 'On Defense', content: <SiteTab stats1={firstStatBoxData} roundwon={50} roundlose={100} /> },
    { label: 'Best Map', content: <BestMapTab mapList={mapList} /> },
  ];

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
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.goBack()}>
            <FontAwesome
              name="angles-left"
              color={colors.darkGray}
              size={18}
              style={styles.backicon}
            />
          </TouchableOpacity>
          <View style={{ marginTop: 'auto' }}>
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
      <View style={styles.tabs}>
        <TabBar tabs={tabs} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  details: {
    flexDirection: 'row',
    height: 260,
    borderBottomWidth: 0.6,
    borderBottomColor: colors.black,
    paddingVertical: sizes['2xl'],
    paddingHorizontal: sizes['4xl'],
  },
  meta: {
    paddingTop: sizes['3xl'],
  },
  backicon: {
    paddingTop: sizes.md,
    paddingBottom: sizes.md,
  },
  title: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['15xl'],
    color: colors.black,
    letterSpacing: -0.9,
    paddingBottom: sizes.md,
    textTransform: 'capitalize',

  },
  subtext: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md + 1,
    paddingTop: sizes.md,
    marginBottom: -3,
    lineHeight: fonts.sizes.md + 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  dropdowncontainer: {
    flexDirection: 'row',
    marginTop: sizes['4xl'],
    alignItems: 'center',
    paddingBottom: sizes.md,
    zIndex: 1,
  },
  imagecontainer: {
    width: '60%',
    position: 'absolute',
    right: 0,
    marginRight: -sizes.xl,
  },
  image: {
    width: '100%',
    height: 260,
    resizeMode: 'contain',
  },
  tabs: {
    flex: 1,
    zIndex: 0
  }
});

export default AgentInfoScreen