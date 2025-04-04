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
import { useAuth } from '../context/AuthContext';

export default function LoadingScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [loadingStarted, setLoadingStarted] = useState<boolean>(false);
  const dataFetchInitiated = useRef<boolean>(false);

  const {
    fetchUserData,
    isLoading,
    error: contextError,
    isDataReady,
    userData
  } = useDataContext();

  const {userPuuid, authStatusChecked} = useAuth();

  // Fetch data only once
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!authStatusChecked || !userPuuid) {
        return;
      }

      if (dataFetchInitiated.current) {
        return;
      }

      dataFetchInitiated.current = true;
      console.log('[LOG] LoadingScreen: Initiating data fetch for PUUID:', userPuuid);
      setLoadingStarted(true);

      try {
        await fetchUserData(userPuuid);
        processUserData(userPuuid);
        console.log('[LOG] LoadingScreen: fetchUserData call completed');
      } catch (err) {
        console.error('[ERROR] LoadingScreen: Error in fetchCurrentUser:', err);
        dataFetchInitiated.current = false;
      }
    };

    fetchCurrentUser();
  }, [fetchUserData, authStatusChecked, userPuuid]);

  // Navigate to BottomTabs when data is ready
  useEffect(() => {
    if (isDataReady) {
      console.log('[LOG] LoadingScreen: Data ready, navigating to BottomTabs');
      setTimeout(() => {
        navigation.navigate('BottomTabs');
      }, 300);
    }
  }, [isDataReady, navigation]);

  // Handle errors
  useEffect(() => {
    if (contextError) {
      console.error('[ERROR] Error from context:', contextError);

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
