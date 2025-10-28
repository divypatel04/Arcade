import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, sizes, fonts } from '@theme';

export interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = colors.gray200,
  progressColor = colors.primary,
  showLabel = false,
  label,
  animated = true,
  style,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animated, animatedWidth]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={style}>
      {(showLabel || label) && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label || ''}</Text>
          <Text style={styles.percentage}>{`${Math.round(clampedProgress)}%`}</Text>
        </View>
      )}
      
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progress,
            {
              width: widthInterpolated,
              backgroundColor: progressColor,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes.xs,
  },
  label: {
    ...fonts.styles.bodySmall,
    color: colors.textSecondary,
  },
  percentage: {
    ...fonts.styles.bodySmall,
    fontWeight: fonts.weights.medium,
    color: colors.textPrimary,
  },
  track: {
    width: '100%',
    borderRadius: sizes.borderRadius.full,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: sizes.borderRadius.full,
  },
});

export default ProgressBar;
