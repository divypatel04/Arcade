import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import TabBar from '../components/TabBar'
import MatchOverviewTab from '../components/Tabs/MatchOverviewTab'
import TeamStatsTab from '../components/Tabs/TeamStatsTab';
import RoundPerfTab from '../components/Tabs/RoundPerfTab';
import PlayerVsTab from '../components/Tabs/PlayerVsTab';


const MatchInfoScreen = () => {

  const navigation = useNavigation<StackNavigationProp<any>>();


  const tabs = [
    { label: 'Overview', content: <MatchOverviewTab/> },
    { label: 'Team Stats', content: <TeamStatsTab/> },
    { label: 'Round by Round', content: <RoundPerfTab/> },
    { label: 'vs Player', content: <PlayerVsTab/> },
    // { label: 'Charts', content: <ChartsTab/> },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome
            name="angles-left"
            color={colors.darkGray}
            size={20}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <Text style={styles.headertitle}>About Match</Text>
      </View>
      <View>
        <TabBar tabs={tabs}/>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {

    paddingBottom: 0,
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    padding: sizes['2xl'],
    paddingVertical: sizes['3xl'],
    paddingBottom: 0,
  },
  headertitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['13xl'],
    color: colors.black,
    letterSpacing: -0.7,
    paddingBottom: sizes['2xl'],
  },
  backicon: {
    paddingTop: sizes.md,
    paddingBottom: sizes.md,
  },
});

export default MatchInfoScreen;