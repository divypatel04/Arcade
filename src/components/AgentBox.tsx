import React from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AgentStatType } from '../types/AgentStatsType';
import { getActiveOrRecentSeason } from '../utils';

interface AgentBoxType {
  bestAgent: AgentStatType;
}

const AgentBox = ({bestAgent}: AgentBoxType) => {

  const navigation = useNavigation<StackNavigationProp<any>>();
  const currentStats = getActiveOrRecentSeason(bestAgent);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('AgentListScreen')} activeOpacity={0.6} style={styles.agentcontainer}>
      <View style={styles.agentimagecontainer}>
        <ImageBackground source={{uri: bestAgent.agent.imageUrl}} style={styles.agentimage}>
        </ImageBackground>
      </View>
      <View style={styles.agentmetacontainer}>
        <Text style={styles.agentsubtext}>Best Agent</Text>
        <Text
          style={styles.agentname}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          {bestAgent.agent.name}
        </Text>
        <View style={styles.agentmetadetails}>
          <Text style={styles.agentmetatitle}>Matches Played:</Text><Text style={styles.agentmetavalue}>{currentStats.stats.matchesWon + currentStats.stats.matchesLost}</Text>
        </View>
        <View style={styles.agentmetadetails}>
          <Text style={styles.agentmetatitle}>Kills:</Text><Text style={styles.agentmetavalue}>{currentStats.stats.kills}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  agentcontainer: {
    backgroundColor: colors.primary,
    marginTop: sizes['22xl'],
    padding: sizes['5xl'],
    flexDirection: 'row',
  },
  agentimagecontainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 0,
  },
  agentimage: {
    height: 260,
    aspectRatio: 7.6 / 9,
    resizeMode: 'contain',
    marginRight: -sizes.xl,
  },
  agentmetacontainer: {
  },
  agentmetadetails: {
    paddingBottom: sizes.md,
    flexDirection: 'row',
  },
  agentmetatitle: {
    fontFamily: fonts.family.proximaBold,
    color: colors.black,
  },
  agentmetavalue: {
    paddingLeft: sizes.sm,
    fontFamily: fonts.family.proximaBold,
    color: colors.darkGray,
  },
  agentsubtext: {
    paddingTop: sizes.sm,
    fontFamily: fonts.family.proximaSemiBold,
    fontSize: fonts.sizes.md + 1,
    textTransform: 'uppercase',
    color: colors.darkGray,
  },
  agentname: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['15xl'],
    lineHeight: fonts.sizes['15xl'],
    textTransform: 'capitalize',
    letterSpacing: -0.4,
    color: colors.black,
    marginBottom: sizes['6xl'],
  },
});

export default AgentBox