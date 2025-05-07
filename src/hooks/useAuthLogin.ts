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

const useDeepLinking = () => {
  const {setIsAuthenticated} = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Function to update user in the database
  const updateUserDatabase = async (userData: any) => {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          puuid: userData.puuid,
          region: userData.region,
          name: userData.name || userData.gameName,
          tagline: userData.tagline || userData.tagLine,
          lastUpdated: new Date(),
          matchId: [] // Empty array as required
        }, {
          onConflict: 'puuid'
        });

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
      const url = event.url;
      if (url.startsWith('arcadeauth://')) {
        const tokensParamStart = url.indexOf('tokens=') + 'tokens='.length;
        if (tokensParamStart > -1) {
          const tokensParam = url.substring(tokensParamStart);
          try {
            const decodedTokens = JSON.parse(decodeURIComponent(tokensParam));

            const tokens = {
              refreshToken: decodedTokens.refresh_token,
              idToken: decodedTokens.id_token,
              accessToken: decodedTokens.access_token,
            };
            await AsyncStorage.setItem('tokens', JSON.stringify(tokens));

            let userData = await fetchRiotAccount(tokens.accessToken);
            let region = await fetchUserRegion(userData.puuid);
            userData.region = region;

            // -6KG-X-bb86rh70DxTjUWx9S6xayM0iYespoQ-2yKkgzhLgWD0gufwXj779nUGvPV9TNWviIp2fpZA
            const success = await login("-6KG-X-bb86rh70DxTjUWx9S6xayM0iYespoQ-2yKkgzhLgWD0gufwXj779nUGvPV9TNWviIp2fpZA");

            // Update the user database after successful login
            await updateUserDatabase(userData);

            const userDetails = supabase.auth.getUser();
            const userId = (await userDetails).data.user?.id;
            if (userId) {
              updateAnonymousUserName(userId, `${userData.name}#${userData.tagline}`);
            }

            if (success) {
              navigation.navigate('Loading');
            } else {
              // Handle login failure
              console.error('Failed to login');
            }
            setIsAuthenticated(true);
          } catch (error: any) {
            // console.error('Error: ', error);
            ToastAndroid.showWithGravity(
              'Something Went Wrong. Try Again',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          }
          setIsLoading(false);
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  return {isLoading, setIsLoading};
};

export default useDeepLinking;
