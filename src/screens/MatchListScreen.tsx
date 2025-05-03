import React, { useEffect } from 'react'
import { RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native'
import { colors, fonts, sizes } from '@theme'
import { getMatchQueueTypes, formatDateString, sortAndGroupMatchHistory, isPremiumUser } from '@utils'
import { MatchStatsType } from '@types'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import { useDataContext } from '@context'
import { DropDown, PremiumModal, MatchBox } from '@components'
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

interface resultArray {
  data: MatchStatsType[];
  title: string;
}

const MatchListScreen = () => {
  const {matchStats, userData} = useDataContext();
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Check if matchStats is empty or undefined
  const hasMatchStats = matchStats && matchStats.length > 0;

  // Only get game types if we have match stats
  const gameType = hasMatchStats ? getMatchQueueTypes(matchStats) : ['All'];
  const [selectedGameType, setSelectedGameType] = React.useState(gameType[0]);
  const [finalMatchArray, setFinalMatchArray] = React.useState<resultArray[]>([]);
  const [premiumModalVisible, setPremiumModalVisible] = React.useState(false);
  const [selectedPremiumMatch, setSelectedPremiumMatch] = React.useState<MatchStatsType | null>(null);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // fetch data
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (hasMatchStats) {
      if (selectedGameType == 'All') {
        setFinalMatchArray(sortAndGroupMatchHistory(matchStats));
      } else {
        let filterArray = matchStats.filter((m) => m.stats.general.queueId == selectedGameType);
        setFinalMatchArray(sortAndGroupMatchHistory(filterArray));
      }
    }
  }, [selectedGameType, hasMatchStats]);

  const handleMatchPress = (match: MatchStatsType) => {
    if (match.isPremiumStats && !isPremiumUser(userData)) {
      setSelectedPremiumMatch(match);
      setPremiumModalVisible(true);
    } else {
      navigation.navigate('MatchInfoScreen', { match: match });
    }
  };
  const handleWatchAd = () => {
    setPremiumModalVisible(false);
    if (selectedPremiumMatch) {
      navigation.navigate('MatchInfoScreen', { match: selectedPremiumMatch });
    }
  };
  const handleBuyPremium = () => {
    setPremiumModalVisible(false);
    navigation.navigate('PremiumSubscriptionScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headertitle}>{t('common.matches')}</Text>

      {hasMatchStats && (
        <View style={styles.filtersection}>
          <DropDown
            list={gameType}
            name={t('common.type')}
            value={selectedGameType}
            onSelect={item => setSelectedGameType(item)}
          />
        </View>
      )}

      {hasMatchStats ? (
        <SectionList
          contentContainerStyle={{ flexGrow: 1 }}
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
              isPremium={item.isPremiumStats ?? false}
              match={item}
              onPress={() => handleMatchPress(item)}
            />
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome
            name="gamepad"
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
    padding: sizes['2xl'],
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
    fontSize: fonts.sizes['2xl'],
    textTransform: 'uppercase',
    color: colors.black,
    paddingBottom: sizes.xl,
    paddingTop: sizes['2xl'],
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
    color: colors.black,
    marginBottom: sizes.xl,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  emptyMessage: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.xl,
    color: colors.darkGray,
    textAlign: 'center',
    lineHeight: fonts.sizes['4xl'],
  },
});

export default MatchListScreen