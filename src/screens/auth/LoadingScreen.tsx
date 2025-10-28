import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Icon } from '@components';

export const LoadingScreen: React.FC = () => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Icon name="controller" size={80} color={colors.primary} />
        <Text style={styles.appName}>Arcade</Text>
        <Text style={styles.tagline}>Valorant Stats Tracker</Text>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your stats...</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: sizes['3xl'],
  },
  appName: {
    ...fonts.styles.h1,
    color: colors.textPrimary,
    marginTop: sizes.lg,
    fontWeight: fonts.weights.bold,
  },
  tagline: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    marginTop: sizes.sm,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    marginTop: sizes.md,
  },
  footer: {
    position: 'absolute',
    bottom: sizes.xl,
  },
  version: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
  },
});

export default LoadingScreen;
