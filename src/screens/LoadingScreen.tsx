import React, { useEffect, useState } from 'react';
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
import { supabase } from '../lib/supabase';

export default function LoadingScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [localError, setLocalError] = useState<Error | null>(null);
  const [fetchingUser, setFetchingUser] = useState<boolean>(true);

  const {
    fetchUserData,
    isLoading,
    error: contextError,
    isDataReady
  } = useDataContext();

  // First, fetch the current user's PUUID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setFetchingUser(true);
        // Get the current authenticated user
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session?.user) {
          // No authenticated user, redirect to authentication
          navigation.navigate('Auth');
          return;
        }

        // Get the user details including PUUID from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .single();

        if (userError) throw userError;

        if (!userData || !userData.puuid) {
          throw new Error('User PUUID not found');
        }

        // Pass the PUUID to our context to fetch all related data
        fetchUserData(userData.puuid);
      } catch (err) {
        setLocalError(err as Error);
        console.error('Error fetching user:', err);
      } finally {
        setFetchingUser(false);
      }
    };

    fetchCurrentUser();
  }, [navigation, fetchUserData]);

  // Navigate to main screen when data is loaded and ready
  useEffect(() => {
    if (isDataReady) {
      // All data is loaded, navigate to main screen
      navigation.navigate('MainScreen');
    }
  }, [isDataReady, navigation]);

  // Handle errors
  useEffect(() => {
    if (localError || contextError) {
      Alert.alert(
        'Error',
        'There was a problem loading your data. Please try again.',
        [
          {
            text: 'Retry',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Loading' }]
            })
          }
        ]
      );
    }
  }, [localError, contextError, navigation]);

  return (
    <View style={styles.wrapper}>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
      <Image
        style={styles.logo}
        source={require('../assets/images/logo_black.png')}
      />
      <ActivityIndicator size="small" color={'#000'} />
      <Text style={styles.text}>Loading...</Text>
      {(fetchingUser || isLoading) && (
        <Text style={styles.subText}>Fetching your latest game data...</Text>
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
  }
});
