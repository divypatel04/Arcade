import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { colors, sizes } from '@theme';

// Note: Google Mobile Ads will be configured later
// This is a placeholder component structure

export interface BannerAdProps {
  adUnitId?: string;
  containerStyle?: ViewStyle;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  adUnitId,
  containerStyle,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // TODO: Implement Google Mobile Ads banner
  // For now, return a placeholder

  if (hasError || !isLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Banner ad will be rendered here */}
      <View style={styles.placeholder}>
        {/* Placeholder for banner ad */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: sizes.md,
  },
  placeholder: {
    width: '100%',
    height: 50,
    backgroundColor: colors.gray100,
    borderRadius: sizes.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
});

export default BannerAd;
