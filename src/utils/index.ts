import { mergeAgentSeasonalStats, mergeMapSeasonalStats, mergeWeaponSeasonalStats, mergeActSeasonalStats, mergeUtilitiesAndAbilities } from './mergeUtils';
import { determinePremiumAgentStats, determinePremiumMapStats, determinePremiumWeaponStats, determinePremiumSeasonStats, determinePremiumMatchStats } from './premiumUtils';
import { getTopAgentByKills, getTopMapByWinRate, getTopWeaponByKills, getMatchQueueTypes, sortAgentsByMatches, sortMapsByMatches, sortWeaponsByMatches, sortAndGroupMatchHistory } from './sortUtils'
import { getAllSeasonNames, getCurrentOrMostRecentSeason, getCurrentorRecentSeasonStats, getSortedSeasonNames } from './seasonalUtils';
import { formatDateString, convertMillisToReadableTime, isPremiumUser, getSupabaseImageUrl, checkUpdateNeeded, updateAnonymousUserName, signInAnonymously  } from './generalUtils';
import {loadRewardedAd, getAdUnitId} from './adUtils';

export {
  mergeAgentSeasonalStats,
  mergeMapSeasonalStats,
  mergeWeaponSeasonalStats,
  mergeActSeasonalStats,
  mergeUtilitiesAndAbilities,
  determinePremiumAgentStats,
  determinePremiumMapStats,
  determinePremiumWeaponStats,
  determinePremiumSeasonStats,
  determinePremiumMatchStats,
  getTopAgentByKills,
  getTopMapByWinRate,
  getTopWeaponByKills,
  getMatchQueueTypes,
  sortAgentsByMatches,
  sortMapsByMatches,
  sortWeaponsByMatches,
  sortAndGroupMatchHistory,
  getAllSeasonNames,
  getCurrentOrMostRecentSeason,
  getCurrentorRecentSeasonStats,
  getSortedSeasonNames,
  formatDateString,
  convertMillisToReadableTime,
  isPremiumUser,
  loadRewardedAd,
  getAdUnitId,
  getSupabaseImageUrl,
  checkUpdateNeeded,
  updateAnonymousUserName,
  signInAnonymously
};


