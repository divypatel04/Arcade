import axios from 'axios';
import {APIKEY} from './config';

interface MatchDetailsApiProps {
  matchIds: string[];
  region: string;
}

export const fetchMatchDetails = async ({
  matchIds,
  region,
}: MatchDetailsApiProps) => {
  const matchDetails: any[] = [];
  let rateLimitCount = 0;

  const batchSize = 45; // Define the batch size

  // Split matchIds into smaller batches
  const batches = [];
  for (let i = 0; i < matchIds.length; i += batchSize) {
    batches.push(matchIds.slice(i, i + batchSize));
  }

  // Define a function to fetch a batch of match details
  const fetchBatch = async (batch: any) => {
    const batchPromises = batch.map(async (matchId: string) => {
      const apiUrl = `https://${region}.api.riotgames.com/val/match/v1/matches/${matchId}?api_key=${APIKEY}`;
      try {
        const response = await axios.get(apiUrl);
        matchDetails.push(response.data);
      } catch (error: any) {
        if (error.response && error.response?.status === 429) {
          rateLimitCount++;
          const retryAfter = error.response.headers['retry-after'];
          if (retryAfter) {
            const delay = parseInt(retryAfter, 10) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } else {
          console.log('error: ', error);
        }
        console.log('error: ', error);
      }
    });

    await Promise.all(batchPromises);
  };

  // Fetch match details in smaller batches
  for (const batch of batches) {
    await fetchBatch(batch);
  }

  console.log(
    `Successfully fetched ${matchDetails.length} MatchDetails from APIs with ${rateLimitCount} Rate-Limit hits`,
  );
  return matchDetails;
};
