import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AgentStatType } from '../types/AgentStatsType';
import { getCurrentOrMostRecentSeason, getSupabaseImageUrl } from '../utils';
import { useTranslation } from 'react-i18next';

interface AgentBoxType {
  bestAgent: AgentStatType | null;
}

const AgentBox = ({bestAgent}: AgentBoxType) => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();

  // If bestAgent exists, get current stats, otherwise set to null
  const currentStats = bestAgent ? getCurrentOrMostRecentSeason(bestAgent) : null;

  // Placeholder values for when bestAgent is null
  const agentName = bestAgent?.agent?.name ?? 'Agent';
  const agentImage = bestAgent?.agent?.image ? getSupabaseImageUrl(bestAgent.agent.image) : '';
  const matchesPlayed = (currentStats?.stats?.matchesWon ?? 0) + (currentStats?.stats?.matchesLost ?? 0);
  const kills = currentStats?.stats?.kills ?? 0;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('AgentListScreen')} activeOpacity={0.6} style={styles.agentcontainer}>
      <View style={styles.agentmetacontainer}>
        <Text style={styles.agentsubtext}>{t('home.bestAgent')}</Text>
        <Text
          style={styles.agentname}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          {agentName}
        </Text>
        <View style={styles.agentmetadetails}>
          <Text style={styles.agentmetatitle}>{t('home.matchPlayed')}:</Text><Text style={styles.agentmetavalue}>{matchesPlayed}</Text>
        </View>
        <View style={styles.agentmetadetails}>
          <Text style={styles.agentmetatitle}>{t('home.kills')}:</Text><Text style={styles.agentmetavalue}>{kills}</Text>
        </View>
      </View>
      <Image
        style={styles.agentimage}
        source={{uri: agentImage}}
        defaultSource={require('../assets/images/jett_image.png')}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  agentcontainer: {
    backgroundColor: colors.primary,
    marginTop: sizes['22xl'],
    padding: sizes['5xl'],
    position: 'relative',
  },
  agentmetacontainer: {
    zIndex: 1,
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
  agentimage: {
    width: '60%',
    height: 250,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
});

export default AgentBox