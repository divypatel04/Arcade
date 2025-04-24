import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { colors, fonts, sizes } from '../theme';

interface BannerAdContainerProps {
  containerStyle?: object;
}

const BannerAdContainer: React.FC<BannerAdContainerProps> = ({ containerStyle }) => {
  const [adLoaded, setAdLoaded] = useState(false);

  // Use test IDs during development
  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS === 'ios'
      ? 'ca-app-pub-xxxxxxxx/yyyyyyyy'  // Replace with your iOS banner ad unit ID
      : 'ca-app-pub-8137963668346387/yyyyyyyy'; // Replace with your Android banner ad unit ID

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.adText}>Advertisement</Text>
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={() => setAdLoaded(true)}
          onAdFailedToLoad={(error) => {
            console.error('Banner ad failed to load:', error);
            setAdLoaded(false);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.white,
    padding: sizes.sm,
    borderRadius: 8,
    marginVertical: sizes.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  adText: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    marginBottom: sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  }
});

export default BannerAdContainer;
