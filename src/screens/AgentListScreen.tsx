import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, sizes } from '../theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AgentStatType } from '@types';
import { getAllSeasonNames, isPremiumUser, sortAgentsByMatches } from '@utils';
import { useDataContext } from '@context';
import { useTranslation } from 'react-i18next';
import { AgentCard, DropDown, PremiumModal } from '@components';

interface AgentListProps {
  agentStat: AgentStatType,
  seasonName: string,
  numberOfMatches: number
}

const AgentListScreen = () => {
  const { t } = useTranslation();
  const {agentStats, userData} = useDataContext();
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Check if agentStats is empty or undefined
  const hasAgentStats = agentStats && agentStats.length > 0;

  // Only get season names if we have agent stats
  const seasonNames = hasAgentStats ? getAllSeasonNames(agentStats) : [''];
  const [selectedSeason, setselectedSeason] = useState(hasAgentStats ? seasonNames[1] : '');
  const [agentList,setAgentList] = useState<AgentListProps[]>();
  const [premiumModalVisible, setPremiumModalVisible] = useState(false);
  const [selectedPremiumAgent, setSelectedPremiumAgent] = useState<AgentStatType | null>(null);

  useEffect(() => {
    if (hasAgentStats) {
      const agentList = sortAgentsByMatches(agentStats, selectedSeason);
      setAgentList(agentList);
    }
  }, [selectedSeason, hasAgentStats]);

  const handleAgentPress = (agent: AgentStatType) => {
    if (agent.isPremiumStats && !isPremiumUser(userData)) {
      setSelectedPremiumAgent(agent);
      setPremiumModalVisible(true);
    } else {
      navigation.navigate('AgentInfoScreen', { agent: agent, seasonName: selectedSeason });
    }
  };

  const handleWatchAd = () => {
    setPremiumModalVisible(false);
    if (selectedPremiumAgent) {
      navigation.navigate('AgentInfoScreen', { agent: selectedPremiumAgent, seasonName: selectedSeason });
    }
  };
  const handleBuyPremium = () => {
    setPremiumModalVisible(false);
    navigation.navigate('PremiumSubscriptionScreen'); // Assuming this screen exists
  };

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
        <Text style={styles.headertitle}>{t('listScreen.agents')}</Text>
        {hasAgentStats && (
          <View style={styles.dropdowncontainer}>
            <DropDown
              list={seasonNames}
              name={t('common.season')}
              value={selectedSeason}
              onSelect={item => setselectedSeason(item)}
            />
          </View>
        )}
      </View>

      {hasAgentStats ? (
        <FlatList
          data={agentList}
          renderItem={({ item }) => (
            <AgentCard
              isPremium={item.agentStat.isPremiumStats ?? false}
              agent={item}
              onPress={() => handleAgentPress(item.agentStat)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="user-secret"
            color={colors.darkGray}
            size={64}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>{t('common.noDataAvailable')}</Text>
          <Text style={styles.emptyMessage}>
            {t('common.noMatchesPlayed')}
          </Text>
        </View>
      )}

      <PremiumModal
        visible={premiumModalVisible}
        onClose={() => setPremiumModalVisible(false)}
        onWatchAd={handleWatchAd}
        onBuyPremium={handleBuyPremium}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sizes['6xl'],
  },
  emptyIcon: {
    marginBottom: sizes['4xl'],
    opacity: 0.6,
  },
  emptyTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['7xl'],
    textTransform:'lowercase',
    color: colors.black,
    marginBottom: sizes.xl,
    textAlign: 'center',
  },
  emptyMessage: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.xl,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: fonts.sizes['4xl'],
  },
});

export default AgentListScreen