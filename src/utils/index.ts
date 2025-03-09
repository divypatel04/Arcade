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

import {getTopWeaponByKills, getAllWeaponSeasonNames, sortWeaponsByMatches, aggregateWeaponStatsForAllActs} from './weaponUtils';

import {getCurrentorRecentSeasonStats,getSeasonNames, aggregateSeasonStatsForAllActs} from './seasonUtils';



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
  mergeUtilitiesAndAbilities
};
