import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, sizes, fonts } from '@theme';

export interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  animated?: boolean;
  label?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  progressColor = colors.primary,
  backgroundColor = colors.gray200,
  showPercentage = true,
  animated = true,
  label,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const validProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: validProgress,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      animatedValue.setValue(validProgress);
    }
  }, [validProgress, animated, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {showPercentage && (
        <View style={styles.textContainer}>
          <Text style={[styles.percentage, { fontSize: size * 0.2 }]}>
            {Math.round(validProgress)}%
          </Text>
          {label && (
            <Text style={[styles.label, { fontSize: size * 0.1 }]}>
              {label}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    ...fonts.styles.h4,
    fontWeight: fonts.weights.bold,
    color: colors.textPrimary,
  },
  label: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
});

export default CircularProgress;
