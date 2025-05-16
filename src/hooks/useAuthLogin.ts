import {useEffect, useState} from 'react';
import {Linking, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '@context';
import { fetchRiotAccount } from '@services/api/fetchRiotAccount';
import { fetchUserRegion } from '@services/api/fetchUserRegion';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../lib/supabase';
import { updateAnonymousUserName } from '@utils';

const useAuthLogin = () => {
  const {setIsAuthenticated} = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Function to update user in the database
  const updateUserDatabase = async (userData: any) => {
    try {
      console.log('Starting to update user database with data:', JSON.stringify(userData));
      const { data, error } = await supabase
        .from('users')
        .upsert({
          puuid: userData.puuid,
          region: userData.region,
          name: userData.name || userData.gameName,
          tagline: userData.tagline || userData.tagLine,
        });

      console.log('User data updated:', data);

      if (error) {
        console.error('Error updating user database:', error);
      }
    } catch (err) {
      console.error('Error updating user database:', err);
    }
  };

  useEffect(() => {
    // Handle data when user Return from RSO
    const handleDeepLink = async (event: any) => {
      console.log('Deep link event received:', event);
      console.log('URL from deep link:', event.url);

      const url = event.url;
      if (url.startsWith('arcadeauth://')) {
        console.log('Valid arcadeauth:// URL detected');

        const tokensParamStart = url.indexOf('tokens=') + 'tokens='.length;
        console.log('Tokens param start index:', tokensParamStart);

        if (tokensParamStart > -1) {
          console.log('Found tokens parameter in URL');

          const tokensParam = url.substring(tokensParamStart);
          console.log('Encoded tokens param:', tokensParam);

          try {
            console.log('Attempting to decode and parse tokens');
            const decodedTokens = JSON.parse(decodeURIComponent(tokensParam));
            console.log('Successfully decoded tokens object');

            const tokens = {
              refreshToken: decodedTokens.refresh_token,
              idToken: decodedTokens.id_token,
              accessToken: decodedTokens.access_token,
            };
            console.log('Formatted tokens object:', JSON.stringify({
              refreshTokenLength: tokens.refreshToken?.length,
              idTokenLength: tokens.idToken?.length,
              accessTokenLength: tokens.accessToken?.length
            }));

            console.log('Saving tokens to AsyncStorage');
            await AsyncStorage.setItem('tokens', JSON.stringify(tokens));
            console.log('Tokens saved successfully');

            console.log('Fetching Riot account with access token');
            let userData = await fetchRiotAccount(tokens.accessToken);
            console.log('Riot account data received:', JSON.stringify(userData));

            console.log('Fetching user region with PUUID:', userData.puuid);
            let region = await fetchUserRegion(userData.puuid);
            console.log('User region received:', region);

            userData.region = region;
            console.log('Updated user data with region:', JSON.stringify(userData));

            console.log('Starting user database update');
            // Update the user database after successful login
            await updateUserDatabase(userData);
            console.log('User database update completed');

            console.log('Getting Supabase user details');
            const userDetails = supabase.auth.getUser();
            console.log('User details fetched, extracting ID');
            const userId = (await userDetails).data.user?.id;
            console.log('User ID:', userId);

            if (userId) {
              console.log('Valid userId found:', userId);
              // updateAnonymousUserName(userId, `${userData.name}#${userData.tagline}`);
            }

            console.log('Attempting login with hardcoded token');
            // -6KG-X-bb86rh70DxTjUWx9S6xayM0iYespoQ-2yKkgzhLgWD0gufwXj779nUGvPV9TNWviIp2fpZA
            // VZJtaru0pLtckkjdbAgFyQaJJDi466dzsg7cXBIhYTou4I0AFBgewDmJflGhK7el2FIv5DweUfpadg
            const success = await login(userData.puuid);
            console.log('Login attempt result:', success);

            if(!success) {
              // Handle login failure
              console.error('Failed to login');
            } else {
              console.log('Login successful');
            }
          } catch (error: any) {
            console.error('Error in handleDeepLink:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            ToastAndroid.showWithGravity(
              'Something Went Wrong. Try Again',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          }
          console.log('Setting isLoading to false');
          setIsLoading(false);
        } else {
          console.log('No tokens parameter found in URL');
        }
      } else {
        console.log('URL does not start with arcadeauth://', url);
      }
    };

    console.log('Setting up Linking event listener');
    Linking.addEventListener('url', handleDeepLink);
    console.log('Linking event listener set up successfully');

    return () => {
      console.log('Cleanup: removing Linking event listeners');
      Linking.removeAllListeners('url');
    };
  }, []);

  return {isLoading, setIsLoading};
};

export default useAuthLogin;
