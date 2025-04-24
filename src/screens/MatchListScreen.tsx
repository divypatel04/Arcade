import React, { useEffect } from 'react'
import { Image, RefreshControl, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from '../components/lcon'
import { colors, fonts, sizes } from '../theme'
import DropDown from '../components/DropDown'
import { extractUniqueMatchType, formatDateString, transformMatchStats } from '../utils'
import MatchBox from '../components/MatchBox'
import { MatchStatType } from '../types/MatchStatType'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import { useDataContext } from '../context/DataContext'
import PremiumModal from '../components/PremiumModal'
import { isPremiumUser } from '../utils'

interface resultArray {
  data: MatchStatType[];
  title: string;
}

const MatchListScreen = () => {
  const {matchStats, userData} = useDataContext();
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const gameType = extractUniqueMatchType(matchStats);
  const [selectedGameType, setSelectedGameType] = React.useState(gameType[0]);

  const [finalMatchArray, setFinalMatchArray] = React.useState<resultArray[]>([]);
  const [premiumModalVisible, setPremiumModalVisible] = React.useState(false);
  const [selectedPremiumMatch, setSelectedPremiumMatch] = React.useState<MatchStatType | null>(null);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // fetch data
    }, 1000);
  }, []);

  useEffect(() => {
  if (selectedGameType == 'All') {
    setFinalMatchArray(transformMatchStats(matchStats));
  } else {
    let filterArray = matchStats.filter((m) => m.stats.general.queueId == selectedGameType);
    setFinalMatchArray(transformMatchStats(filterArray));
  }
  }, [selectedGameType]);

  const handleMatchPress = (match: MatchStatType) => {
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
    navigation.navigate('PremiumSubscriptionScreen'); // Assuming this screen exists
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertitle}>{t('common.matches')}</Text>
        <View style={styles.filtersection}>
          <DropDown
            list={gameType}
            name={t('common.type')}
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
            isPremium={item.isPremiumStats ?? false}
            match={item}
            onPress={() => handleMatchPress(item)}
          />
        )}
      />

      <PremiumModal
        visible={premiumModalVisible}
        onClose={() => setPremiumModalVisible(false)}
        onWatchAd={handleWatchAd}
        onBuyPremium={handleBuyPremium}
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