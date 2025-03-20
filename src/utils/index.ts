import {
  getAllAgentSeasonNames,
  aggregateAgentStatsForAllActs,
  convertMillisToReadableTime,
  getCurrentOrMostRecentSeason,
  getTopAgentByKills,
  sortAgentsByMatches,
  mergeUtilitiesAndAbilities
} from './agentUtils';
import {
  aggregateMapStatsForAllActs,
  getAllMapSeasonNames,
  getTopMapByWinRate,
  sortMapsByMatches,
} from './mapUtils';


import {determinePremiumAgentStats,
  determinePremiumMapStats,
  determinePremiumWeaponStats,
  determinePremiumSeasonStats,
  determinePremiumMatchStats
} from './premiumUtils';

import {getTopWeaponByKills, getAllWeaponSeasonNames, sortWeaponsByMatches, aggregateWeaponStatsForAllActs} from './weaponUtils';

import {getCurrentorRecentSeasonStats,getSeasonNames, aggregateSeasonStatsForAllActs} from './seasonUtils';

import {isPremiumUser} from './userUtils';

function formatDateString(dateString: string) {
  const date = parseDate(dateString);

  if (date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
  }

  return dateString;
}

function parseDate(dateString: string) {
  const dateParts = dateString.split('/');
  if (dateParts.length === 3) {
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based
    const year = parseInt(dateParts[2], 10);
    return new Date(year, month, day);
  }
  return null;
}

import {extractUniqueMatchType, transformMatchStats} from './matchUtils';
import { supabase } from '../lib/supabase';

export {
  formatDateString,
  getAllAgentSeasonNames,
  aggregateAgentStatsForAllActs,
  convertMillisToReadableTime,
  getCurrentOrMostRecentSeason,
  getTopAgentByKills,
  sortAgentsByMatches,
  aggregateMapStatsForAllActs,
  getAllMapSeasonNames,
  getTopMapByWinRate,
  sortMapsByMatches,
  getTopWeaponByKills,
  getAllWeaponSeasonNames,
  sortWeaponsByMatches,
  getCurrentorRecentSeasonStats,
  getSeasonNames,
  aggregateSeasonStatsForAllActs,
  aggregateWeaponStatsForAllActs,
  mergeUtilitiesAndAbilities,
  extractUniqueMatchType,
  transformMatchStats,
  isPremiumUser,
  determinePremiumAgentStats,
  determinePremiumMapStats,
  determinePremiumWeaponStats,
  determinePremiumSeasonStats,
  determinePremiumMatchStats
};


export const getSupabaseImageUrl = (imagePath: string) => {
    // If the image URL is already a full URL, return it as is
    if (imagePath?.startsWith('http')) {
      return imagePath;
    }
    // Assuming images are stored in a 'agents' bucket with path structure
    // You may need to adjust this based on your actual Supabase storage structure
    const bucket = 'static-data';
    // Get public URL from Supabase
    const { data } = supabase.storage.from(bucket).getPublicUrl(imagePath);
    return data?.publicUrl || '';
};