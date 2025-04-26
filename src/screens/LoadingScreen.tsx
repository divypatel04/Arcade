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
import { colors, fonts, sizes } from '@theme';
import { useDataContext } from '@context';
import { processUserData } from '@services';
import { useAuth } from '@context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LoadingScreen() {

  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [loadingStarted, setLoadingStarted] = useState<boolean>(false);
  const dataFetchInitiated = useRef<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Loading...');

  const {
    fetchUserData,
    isLoading,
    error: contextError,
    isDataReady,
    userData
  } = useDataContext();

  const {userPuuid, authStatusChecked} = useAuth();

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
      setStatusMessage(t('common.fetchingData'));

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

  useEffect(() => {
    if (isDataReady) {
      setStatusMessage(t('common.dataReady'));
      console.log('[LOG] LoadingScreen: Data ready, navigating to BottomTabs');

      setTimeout(() => {
        if (userData && userData.name) {
          setStatusMessage(`${t('common.welcome')}, ${userData.name.trim()}#${userData.tagline || ''}`);
        }

        setTimeout(() => {
          navigation.navigate('BottomTabs');
        }, 200);
      }, 300);
    }
  }, [isDataReady, navigation, userData]);

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
      <Text style={styles.text}>{t('common.loading')}...</Text>
      <Text style={styles.statusText}>{statusMessage}</Text>
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
    fontSize: fonts.sizes['3xl'],
    textTransform:'lowercase',
    paddingTop: sizes.lg,
  },
  statusText: {
    fontFamily: fonts.family.proximaSemiBold,
    color: colors.darkGray,
    fontSize: fonts.sizes.lg,
    paddingTop: sizes.lg,
  },
});
