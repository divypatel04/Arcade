import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import DropDown from '../components/DropDown';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import AgentCard from '../components/AgentCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { agentStats } from '../data';
import { AgentStatType } from '../types/AgentStatsType';
import { getAllAgentSeasonNames, sortAgentsByMatches } from '../utils';

interface AgentListProps {
  agentStat: AgentStatType,
  seasonName: string,
  numberOfMatches: number
}


const AgentListScreen = () => {

  const navigation = useNavigation<StackNavigationProp<any>>();

  const seasonNames = getAllAgentSeasonNames(agentStats);
  const [selectedSeason, setselectedSeason] = useState(seasonNames[1]);

  const [agentList,setAgentList] = useState<AgentListProps[]>();

  useEffect(() => {
    const agentList = sortAgentsByMatches(agentStats, selectedSeason);
    setAgentList(agentList);
  }, [selectedSeason]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome
            name="angles-left"
            color={colors.darkGray}
            size={18}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <Text style={styles.headertitle}>Agents</Text>
        <View style={styles.dropdowncontainer}>
          <DropDown
            list={seasonNames}
            name="Act"
            value={selectedSeason}
            onSelect={item => setselectedSeason(item)}
          />
        </View>
      </View>

      <FlatList
        data={agentList}
        renderItem={({ item }) => (
          <AgentCard
            isPremium={true}
            agent={item}
            onPress={() => {
              navigation.navigate('AgentInfoScreen', { agent: item.agentStat, seasonName: selectedSeason });
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: sizes.xl,
    backgroundColor: colors.white,
  },
  header: {
    paddingVertical: sizes.xl,
  },
  headertitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['13xl'],
    color: colors.black,
    letterSpacing: -0.7,
  },
  dropdowncontainer: {
    flexDirection: 'row',
    marginTop: sizes['4xl'],
    alignItems: 'center',
    paddingBottom: sizes.md,
  },
  backicon: {
    paddingTop: sizes.md,
    paddingBottom: sizes.md,
  },
});

export default AgentListScreen