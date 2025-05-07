import React, {useRef, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { colors, fonts } from '../theme';
import { Icon } from '../components/lcon';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const {width, height} = Dimensions.get('window');

const Slide = ({item}: any) => {
  return (
    <View style={{alignItems: 'center', width}}>
      <Image
        source={item?.image}
        style={{
          height: '68%',
          width,
          resizeMode: 'contain',
          marginTop: 50,
        }}
      />
      <View>
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.subtitle}>{item?.subtitle}</Text>
      </View>
    </View>
  );
};

const OnboardingScreen = () => {

  const navigation = useNavigation<StackNavigationProp<any>>();

  const {t} = useTranslation();

  const slides = [
    {
      id: '1',
      image: require('../assets/images/screen1.png'),
      title: t('onboarding.title1'),
      subtitle: t('onboarding.description1'),
    },
    {
      id: '2',
      image: require('../assets/images/screen2.png'),
      title: t('onboarding.title2'),
      subtitle: t('onboarding.description2'),
    },
    {
      id: '3',
      image: require('../assets/images/screen3.png'),
      title: t('onboarding.title3'),
      subtitle: t('onboarding.description3'),
    },
  ];

  const {login} = useAuth();


  const onLogin = async () => {
    console.log('Login with Riot ID');
    // -6KG-X-bb86rh70DxTjUWx9S6xayM0iYespoQ-2yKkgzhLgWD0gufwXj779nUGvPV9TNWviIp2fpZA
    // VZJtaru0pLtckkjdbAgFyQaJJDi466dzsg7cXBIhYTou4I0AFBgewDmJflGhK7el2FIv5DweUfpadg
    const puuid = '-6KG-X-bb86rh70DxTjUWx9S6xayM0iYespoQ-2yKkgzhLgWD0gufwXj779nUGvPV9TNWviIp2fpZA';

    const success = await login(puuid);
    if (success) {
      navigation.navigate('Loading');
    } else {
      // Handle login failure
      console.error('Failed to login');
    }
  }


  const openAuth = async () => {
    let authUrl =
      'https://auth.riotgames.com/authorize?client_id=0139d82a-3ffd-4047-a350-5f9e2da1ae79&redirect_uri=https://arcadebackend.onrender.com/oauth&response_type=code&scope=openid+offline_access';
    let authRedirectUrl = 'arcadeauth://oauth2redirect';
    await InAppBrowser.isAvailable();
    // setIsLoading(true);
    const response = await InAppBrowser.openAuth(authUrl, authRedirectUrl, {
      showTitle: false,
      enableUrlBarHiding: true,
      enableDefaultShare: false,
      ephemeralWebSession: false,
    });

    if (response.type === 'success') {
      Linking.openURL(response.url);
    } else {
      Linking.openURL(authUrl);
    }
  };

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = useRef("");
  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.25,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        {/* Indicator container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: colors.black,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}

        <View style={{marginBottom: 20}}>
          <Text style={styles.text}>
            {t('onboarding.byLoginYouAgree')}{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL('https://arcadeapp.site');
              }}>
              {t('onboarding.termsOfService')}
            </Text>{' '}
            and{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL('https://arcadeapp.site');
              }}>
              {t('onboarding.privacyPolicy')}
            </Text>
          </Text>
          <View style={{height: 55}}>
            <TouchableOpacity
              style={styles.btn}
              onPress={openAuth}
              // disabled={isLoading}
              >
              <Text style={styles.btnText}>
                {/* {isLoading ? (
                  'Loading...'
                ) : ( */}
                  <>
                    {t('onboarding.loginWithRiotID')}
                    <Icon
                      name={'external-link-fill'}
                      size={16}
                      color={colors.white}
                      style={styles.btnIcon}
                    />
                  </>
                {/* )} */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} />
      <FlatList
        // ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: colors.darkGray,
    fontSize: 12,
    marginTop: 10,
    maxWidth: '70%',
    textAlign: 'center',
    alignSelf: 'center',
    lineHeight: 18,
    fontFamily: fonts.family.proximaBold,
  },
  title: {
    color: colors.black,
    fontSize: 38,
    lineHeight: 40,
    fontFamily: fonts.family.novecentoUltraBold,
    marginTop: 20,
    textTransform: 'lowercase',
    marginHorizontal: 20,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    height: 4,
    width: 10,
    backgroundColor: 'grey',
    marginHorizontal: 3,
  },
  btnContainer: {
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  btn: {
    flex: 1,
    height: 55,
    backgroundColor: colors.black,
    // borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  btnText: {
    fontSize: 18,
    fontFamily: fonts.family.novecentoUltraBold,
    color: colors.white,
    textTransform: 'lowercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  btnIcon: {
    marginLeft: 8,
    marginBottom: -2,
  },
  text: {
    color: 'black',
    fontSize: 12,
    paddingBottom: 6,
    opacity: 0.4,
    fontFamily: fonts.family.proximaRegular,
    lineHeight: 16,
    paddingHorizontal: 2,
  },
  link: {
    color: '#0000FF',
  },
});
export default OnboardingScreen;
