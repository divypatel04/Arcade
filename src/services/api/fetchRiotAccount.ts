import axios from 'axios';

export const fetchRiotAccount = async (accessToken: string) => {
  const maxRetries = 3; // Set the maximum number of retries
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const apiUrl = `https://asia.api.riotgames.com/riot/account/v1/accounts/me`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        return response.data;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        // Rate limit exceeded, wait for 1000 milliseconds before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
      } else {
        // Handle other errors
        console.error('Error fetching Riot account data:', error.message);
      }
    }
  }

  return null;
};
