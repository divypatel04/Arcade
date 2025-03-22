import { MatchStatType } from "../types/MatchStatType";


export const extractUniqueMatchType = (matchStats: MatchStatType[]) => {
  const MatchTypeSet: any = {};

  if (matchStats) {
    for (const match of matchStats) {
      if (!MatchTypeSet[match.stats.general.queueId]) {
        MatchTypeSet[match.stats.general.queueId] = {
          queueId: match.stats.general.queueId,
        };
      }
    }
  }

  const MatchTypes = Object.values(MatchTypeSet);

  const final = MatchTypes.map((season: any) => season.queueId).sort((a, b) =>
    b.localeCompare(a),
  );

  final.unshift('All');


  return final;
};

interface resultArray {
  data: MatchStatType[];
  title: string;
}

export function transformMatchStats(
  matchStats: MatchStatType[],
): resultArray[] {
  // Create an empty array to store the result
  const resultArray: resultArray[] = [];

  // Iterate through the matchStats array
  if (matchStats) {
    for (const matchStat of matchStats) {
      // Convert gameStartMillis to a Date object
      const gameStartDate = new Date(matchStat.stats.general.gameStartMillis);

      // Format the date as "dd/mm/yyyy"
      const formattedDate = `${gameStartDate.getDate()}/${
        gameStartDate.getMonth() + 1
      }/${gameStartDate.getFullYear()}`;

      // Find an existing entry in resultArray with the same date
      const existingEntry = resultArray.find(
        entry => entry.title === formattedDate,
      );

      // Create a new entry if it doesn't exist
      if (!existingEntry) {
        resultArray.push({
          data: [matchStat], // Add the current matchStat
          title: formattedDate,
        });
      } else {
        // Add the current matchStat to the existing entry's data array
        existingEntry.data.push(matchStat);
      }
    }
  }

  const sortedResultArray = resultArray.sort((a, b) => {
    const dateA = new Date(a.title).getTime();
    const dateB = new Date(b.title).getTime();
    return dateA - dateB;
  });

  return sortedResultArray;
}