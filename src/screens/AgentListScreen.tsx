import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import DropDown from '../components/DropDown';

const AgentListScreen = () => {

  const ses = ['seso11', 'seso11', 'seso11', 'seso11', 'seso11'];

  const [selectedAct, setSelectedAct] = useState(ses[0]);

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headertitle}>Agents</Text>
        <View style={styles.filterSection}>
        <DropDown
            list={ses}
            name="Act"
            value={selectedAct}
            onSelect={item => setSelectedAct(item)}
          />
        </View>
      </View>


      {/* <View style={styles.header}>
        <TouchableOpacity
          // onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <FontAwesome
            name="arrow-left-long"
            color={Colors.grey}
            size={20}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agents</Text>
        <View style={styles.filterSection}>
          <DropDown
            list={allSeasons}
            name="Act"
            value={selectedAct}
            onSelect={item => setSelectedAct(item)}
          />
        </View>
      </View> */}

      {/* <FlatList
        data={filteredAgentList}
        renderItem={({item}) => (
          <AgentBox
            item={item}
            onPress={() => {
              if (loaded) {
                showAd();
              }
              navigation.navigate('AgentDetailsScreen', {
                agent: item.agent,
                seasonName: item.seasonName,
              });
            }}
          />
        )}
        keyExtractor={item => item.agent.characterId}
        showsVerticalScrollIndicator={false}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: sizes.xl,
  },
  header:{
    paddingVertical: sizes.xl,
  },
  headertitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['13xl'],
    color: colors.black,
    letterSpacing: -0.7,
  },
  filterSection: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    paddingBottom: 5,
  },
});

export default AgentListScreen