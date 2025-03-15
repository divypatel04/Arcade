import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { colors, fonts } from '../theme';
import { useDataContext } from '../context/DataContext';
import { processUserData } from '../services';

export default function LoadingScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [loadingStarted, setLoadingStarted] = useState<boolean>(false);
  // Use ref to track if data fetch has been initiated
  const dataFetchInitiated = useRef<boolean>(false);

  const {
    fetchUserData,
    isLoading,
    error: contextError,
    isDataReady,
    userData
  } = useDataContext();

  // Fetch data only once
  useEffect(() => {
    const fetchCurrentUser = async () => {
      // Only fetch if not already initiated
      if (dataFetchInitiated.current) return;

      dataFetchInitiated.current = true;
      console.log('LoadingScreen: Initiating data fetch (once)');
      setLoadingStarted(true);


      try {
        // Use the hardcoded PUUID for now
        await fetchUserData('-1rAp6FLCdD-ZJTyFbsr14nNndzmK_7WLKi4a-MvuOIPihsOaRGNoL4c0QQWGUWNiIf_tW0jxxm9mA');
        // processUserData('-1rAp6FLCdD-ZJTyFbsr14nNndzmK_7WLKi4a-MvuOIPihsOaRGNoL4c0QQWGUWNiIf_tW0jxxm9mA');
        console.log('LoadingScreen: fetchUserData call completed');
      } catch (err) {
        console.error('LoadingScreen: Error in fetchCurrentUser:', err);
      }
    };

    fetchCurrentUser();
  }, [fetchUserData]);

  // Navigate to BottomTabs when data is ready
  useEffect(() => {
    if (isDataReady) {
      console.log('LoadingScreen: Data ready, navigating to BottomTabs');
      // Small delay to ensure any final state updates complete
      setTimeout(() => {
        navigation.navigate('BottomTabs');
      }, 300);
    }
  }, [isDataReady, navigation]);

  // Handle errors
  useEffect(() => {
    if (contextError) {
      console.error('Error from context:', contextError);

      Alert.alert(
        'Error',
        'There was a problem loading your data. Please try again.',
        [
          {
            text: 'Retry',
            onPress: () => {
              // Reset our flag to allow a retry
              dataFetchInitiated.current = false;
              navigation.reset({
                index: 0,
                routes: [{ name: 'Loading' }]
              });
            }
          }
        ]
      );
    }
  }, [contextError, navigation]);

  return (
    <View style={styles.wrapper}>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
      <Image
        style={styles.logo}
        source={require('../assets/images/logo_black.png')}
      />
      <ActivityIndicator size="small" color={'#000'} />
      <Text style={styles.text}>Loading...</Text>
      {(loadingStarted || isLoading) && (
        <Text style={styles.subText}>Fetching your latest game data...</Text>
      )}
      {userData && (
        <Text style={styles.userText}>
          Welcome, {userData.name}#{userData.tagline || ''}
        </Text>
      )}
      {isDataReady && (
        <Text style={styles.readyText}>Data ready! Redirecting...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: '75%',
    height: '20%',
    resizeMode: 'contain',
  },
  text: {
    fontFamily: fonts.family.novecentoUltraBold,
    color: colors.black,
    fontSize: 20,
    textTransform:'lowercase',
    paddingTop: 8,
  },
  subText: {
    fontFamily: fonts.family.proximaSemiBold,
    color: colors.darkGray,
    fontSize: 14,
    paddingTop: 8,
  },
  readyText: {
    fontFamily: fonts.family.proximaSemiBold,
    color: colors.black,
    fontSize: 14,
    paddingTop: 8,
  },
  userText: {
    fontFamily: fonts.family.proximaSemiBold,
    color: colors.primary || '#4630EB',
    fontSize: 14,
    paddingTop: 8,
  }
});
