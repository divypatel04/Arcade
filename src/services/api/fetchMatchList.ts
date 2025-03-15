import axios from 'axios';
import { APIKEY } from './config';

interface matchApiProps {
  puuid: string;
  region: string;
}

export const fetchMatchList = async ({puuid, region}: matchApiProps) => {
  const maxRetries = 1; // Set the maximum number of retries
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const apiUrl = `https://${region}.api.riotgames.com/val/match/v1/matchlists/by-puuid/${puuid}?api_key=${APIKEY}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.history) {
        const matchIds = response.data.history
          .filter((entry: any) => {
            const allowedQueueIds = ['competitive', 'unrated', 'premier'];
            return allowedQueueIds.includes(entry.queueId);
          })
          .map((entry: any) => entry.matchId);

        setTimeout(() => {
          //console.log("This runs after 3 seconds");
        }, 27000);
        return matchIds;
      }
    } catch (error: any) {
      if (error.response && error.response?.status === 429) {
        // Rate limit exceeded, wait for 1000 milliseconds before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
        console.log(
          'MatchAPI return with Rate limit exceeded[429] error now retring',
        );
      } else {
        console.log('Error in fetchMatchList Error: ', error);
      }
    }
  }

  return null;
};
