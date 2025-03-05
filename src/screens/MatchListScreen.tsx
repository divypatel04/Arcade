import React from 'react'
import { Image, RefreshControl, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from '../components/lcon'
import { colors, fonts, sizes } from '../theme'
import DropDown from '../components/DropDown'
import { formatDateString } from '../utils'
import MatchBox from '../components/MatchBox'

const MatchListScreen = () => {

  const gameType = ['Ranked', 'Unrated', 'Spike Rush', 'Deathmatch', 'Custom'];
  const [selectedGameType, setSelectedGameType] = React.useState(gameType[0]);

  const finalMatchArray = [
    {
      title: '2025-05-03',
      data: [{title: 'Match 1'}, {title: 'Match 2'}, {title: 'Match 3'}],
    },
    {
      title: '2021-09-02',
      data: [{title: 'Match 4'}, {title: 'Match 5'}, {title: 'Match 6'}],
    },
    {
      title: '2021-09-03',
      data: [{title: 'Match 7'}, {title: 'Match 8'}, {title: 'Match 9'}],
    },
  ]

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // fetch data
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertitle}>Matches</Text>
        <View style={styles.filtersection}>
          <DropDown
            list={gameType}
            name="Type"
            value={selectedGameType}
            onSelect={item => setSelectedGameType(item)}
          />
        </View>

        <SectionList
        sections={finalMatchArray}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            progressBackgroundColor={colors.primary}
            colors={[colors.black]}
            tintColor={colors.win}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.SectionTitle}>{formatDateString(title)}</Text>
        )}
        renderItem={({item}) => (
          <MatchBox
            isPremium={true}
            match={item}
            onPress={() => {}}
          />
        )}
      />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: sizes['2xl'],
    paddingBottom: 0,
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingVertical: sizes['3xl'],
    paddingBottom: 0,
  },
  headertitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['13xl'],
    color: colors.black,
    letterSpacing: -0.7,
  },
  filtersection: {
    flexDirection: 'row',
    paddingTop: sizes.xl,
    alignItems: 'center',
    marginBottom: sizes.xl,
  },
  SectionTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: 18,
    textTransform: 'uppercase',
    color: colors.black,
    paddingBottom: 10,
    paddingTop: 12,
  },
});

export default MatchListScreen