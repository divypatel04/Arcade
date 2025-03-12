import React, {useRef, useEffect, useState} from 'react';
import {
  SafeAreaView,
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

const {width, height} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../assets/images/screen1.png'),
    title: 'Welcome to Arcade!',
    subtitle:
      'Unlock a world where your Valorant gaming stats and analytics are at your fingertips.',
  },
  {
    id: '2',
    image: require('../assets/images/screen2.png'),
    title: 'Power Up Your Strategy!',
    subtitle:
      'Explore detailed analytics, discover your strengths and weaknesses',
  },
  {
    id: '3',
    image: require('../assets/images/screen3.png'),
    title: 'Ready, Set, Analyze!',
    subtitle:
      'Simply link your Valorant account and embark on a journey where each stat propels you closer to victory.',
  },
];



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

  const {setIsAuthenticated, login} = useAuth();


  const onLogin = () => {
    console.log('Login with Riot ID');

    login('1234567890');
    setIsAuthenticated(true);
  }

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = useRef();
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
            By Login, you confirm that you accept our{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL('https://arcadeapp.site');
              }}>
              Terms of Use
            </Text>{' '}
            and{' '}
            <Text
              style={styles.link}
              onPress={() => {
                Linking.openURL('https://arcadeapp.site');
              }}>
              Privacy Policy
            </Text>
          </Text>
          <View style={{height: 55}}>
            <TouchableOpacity
              style={styles.btn}
              onPress={onLogin}
              // disabled={isLoading}
              >
              <Text style={styles.btnText}>
                {/* {isLoading ? (
                  'Loading...'
                ) : ( */}
                  <>
                    Login with Riot ID
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
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
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
    </SafeAreaView>
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
