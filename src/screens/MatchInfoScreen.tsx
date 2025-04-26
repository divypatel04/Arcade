import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '@theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MatchStatsType } from '@types';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { MatchOverviewTab, PlayerVsTab, RoundPerfTab, TabBar, TeamStatsTab } from '@components';


const MatchInfoScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route: any = useRoute().params;
  const match: MatchStatsType = route.match;


  const tabs = [
    { label: t('tabs.overview'), content: <MatchOverviewTab matchStats={match}/> },
    { label: t('tabs.teamStats'), content: <TeamStatsTab teamStats={match.stats.teamStats} yourScore={match.stats.playerVsplayerStat.user.stats.roundsWon} enemyScore={match.stats.playerVsplayerStat.user.stats.roundsLost}/> },
    { label: t('tabs.roundTimeline'), content: <RoundPerfTab roundStats={match.stats.roundPerformace}/> },
    { label: t('tabs.pvp'), content: <PlayerVsTab pvpStats={match.stats.playerVsplayerStat} map={match.stats.general.map}/> },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome
            name="angles-left"
            color={colors.darkGray}
            size={20}
            style={styles.backicon}
          />
        </TouchableOpacity>
        <Text style={styles.headertitle}>{t('infoScreen.aboutMatch')}</Text>
      </View>
      <View>
        <TabBar tabs={tabs}/>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
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