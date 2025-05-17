import { StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, sizes } from '@theme';
import { AgentBox, GunBox, MapBox, SeasonBox, BannerAdContainer, Icon } from '@components';
import { getCurrentorRecentSeasonStats, getTopAgentByKills, getTopMapByWinRate, getTopWeaponByKills } from '@utils';
import { useDataContext } from '@context';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@context';
import { AgentStatType, MapStatsType, SeasonStatsType, WeaponStatsType } from '@types';
import { supabase } from '@lib/supabase';
import { dataUpdateTracker } from '@services';


const HomeScreen = () => {
  const { t } = useTranslation();
  const { isLoading } = useLanguage();
  const {agentStats, mapStats, weaponStats, seasonStats} = useDataContext();
  const [updateStatus, setUpdateStatus] = useState<'updating' | 'updated' | null>(null);

  // Check the data update tracker state
  useEffect(() => {
    // Initial check
    checkUpdateStatus();

    // Set up periodic checking to see if update is in progress
    const interval = setInterval(checkUpdateStatus, 5000);

    return () => clearInterval(interval);
  }, []);
  const checkUpdateStatus = () => {
    // Check if an update is in progress
    if (dataUpdateTracker.isUpdating) {
      setUpdateStatus('updating');
      return;
    }

    // If we have a timestamp from less than 10 seconds ago, show "Updated"
    if (dataUpdateTracker.lastUpdateTimestamp) {
      const timeSinceUpdate = new Date().getTime() - dataUpdateTracker.lastUpdateTimestamp.getTime();
      if (timeSinceUpdate < 10000) {
        setUpdateStatus('updated');
        // Clear the "updated" status after 5 seconds
        setTimeout(() => setUpdateStatus(null), 5000);
      } else {
        setUpdateStatus(null);
      }
    }
  }

  const bestAgentStats: AgentStatType | null = getTopAgentByKills(agentStats);
  const bestMapStats: MapStatsType | null = getTopMapByWinRate(mapStats);
  const bestWeaponStats: WeaponStatsType | null = getTopWeaponByKills(weaponStats);
  const currentSeason: SeasonStatsType | null = getCurrentorRecentSeasonStats(seasonStats);

  if (isLoading) {
    return (
      <></>
    );
  }

  return (
    <View style={styles.container}>
       {/* Update Status Indicator */}
       {updateStatus && (
         <View style={styles.updateStatusContainer}>
           {updateStatus === 'updating' ? (
             <>
               <ActivityIndicator size="small" color={colors.primary} />
               <Text style={styles.updateStatusText}>{t('Updating...')}</Text>
             </>
           ) : (             <>
               <Icon name="checkbox-circle-line" size={16} color={colors.secondary} />
               <Text style={styles.updateStatusText}>{t('Updated')}</Text>
             </>
           )}
         </View>
       )}
       <AgentBox bestAgent={bestAgentStats}/>
       <View style={styles.twoboxcontainer}>
         <MapBox bestMap={bestMapStats} />
         <GunBox bestWeapon={bestWeaponStats}/>
       </View>
       <SeasonBox season={currentSeason}/>
       <BannerAdContainer containerStyle={{ marginHorizontal: sizes.xl }} />
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
  twoboxcontainer: {
    paddingVertical: sizes['3xl'],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateStatusContainer: {
    position: 'absolute',
    top: sizes.xl,
    left: sizes.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: sizes.xs,
    paddingHorizontal: sizes.sm,
    borderRadius: sizes.sm,
    zIndex: 999,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },  updateStatusText: {
    fontSize: 12,
    marginLeft: sizes.xs,
    color: colors.darkGray,
  },
});

export default HomeScreen;