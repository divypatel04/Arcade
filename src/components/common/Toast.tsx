import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Icon } from './Icon';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  visible: boolean;
  onHide?: () => void;
  style?: ViewStyle;
}

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        backgroundColor: colors.success,
        icon: 'check-circle' as const,
      };
    case 'error':
      return {
        backgroundColor: colors.error,
        icon: 'alert-circle' as const,
      };
    case 'warning':
      return {
        backgroundColor: colors.warning,
        icon: 'alert' as const,
      };
    case 'info':
    default:
      return {
        backgroundColor: colors.info,
        icon: 'information' as const,
      };
  }
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  visible,
  onHide,
  style,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const config = getToastConfig(type);

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    } else {
      hideToast();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) {
        onHide();
      }
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
        style,
      ]}
      accessible={true}
      accessibilityLabel={`${type} notification: ${message}`}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Icon name={config.icon} size="md" color={colors.white} />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: sizes.lg,
    right: sizes.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes.md,
    paddingHorizontal: sizes.lg,
    borderRadius: sizes.borderRadius.lg,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
    gap: sizes.sm,
  },
  message: {
    ...fonts.styles.body,
    color: colors.white,
    flex: 1,
    fontWeight: fonts.weights.medium,
  },
});

export default Toast;
