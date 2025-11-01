import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BannerAd } from 'react-native-google-mobile-ads';
import { colors, fonts, sizes } from '../theme';
import { getBannerAdUnitId, BANNER_SIZES, DEFAULT_AD_REQUEST_OPTIONS, ADS_ENABLED } from '../services/ads';

interface BannerAdContainerProps {
  containerStyle?: object;
}

const BannerAdContainer: React.FC<BannerAdContainerProps> = ({ containerStyle }) => {
  const [adLoaded, setAdLoaded] = useState(false);

  // Don't render anything if ads are disabled
  if (!ADS_ENABLED) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.adText}>Advertisement</Text>
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={getBannerAdUnitId()}
          size={BANNER_SIZES.STANDARD}
          requestOptions={DEFAULT_AD_REQUEST_OPTIONS}
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
