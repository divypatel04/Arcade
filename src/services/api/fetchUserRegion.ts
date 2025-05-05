import { RIOT_APIKEY } from '@env';
import axios from 'axios';

export const fetchUserRegion = async (puuid: string) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const apiUrl = `https://asia.api.riotgames.com/riot/account/v1/active-shards/by-game/val/by-puuid/${puuid}?api_key=${RIOT_APIKEY}`;
      const response = await axios.get(apiUrl);

      if (response.data) {
        return response.data.activeShard;
      } else {
        return null;
      }
    } catch (error: any) {
      if (error.response && error.response?.status === 429) {
        // Rate limit exceeded, wait for 1000 milliseconds before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
      } else {
        // Handle other errors
        console.error('Error fetching region data:', error.message);
      }
    }
  }
  return null;
};
