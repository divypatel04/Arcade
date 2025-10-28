import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import * as animationPresets from '@animations';

/**
 * Hook for managing animated values and animations
 */
export const useAnimation = (initialValue: number = 0) => {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;

  const fadeIn = (duration?: number) => {
    return animationPresets.fadeIn(animatedValue, { duration });
  };

  const fadeOut = (duration?: number) => {
    return animationPresets.fadeOut(animatedValue, { duration });
  };

  const slideInBottom = (duration?: number) => {
    return animationPresets.slideInBottom(animatedValue, { duration });
  };

  const slideInTop = (duration?: number) => {
    return animationPresets.slideInTop(animatedValue, { duration });
  };

  const scaleUp = (duration?: number) => {
    return animationPresets.scaleUp(animatedValue, { duration });
  };

  const scaleDown = (duration?: number) => {
    return animationPresets.scaleDown(animatedValue, { duration });
  };

  const bounce = () => {
    return animationPresets.bounce(animatedValue);
  };

  const shake = () => {
    return animationPresets.shake(animatedValue);
  };

  const pulse = (config?: { min?: number; max?: number; duration?: number }) => {
    return animationPresets.pulse(animatedValue, config);
  };

  const rotate = (duration?: number) => {
    return animationPresets.rotate360(animatedValue, { duration });
  };

  const spring = (toValue: number, config?: { tension?: number; friction?: number }) => {
    return animationPresets.springAnimation(animatedValue, toValue, config);
  };

  const setValue = (value: number) => {
    animatedValue.setValue(value);
  };

  const reset = () => {
    animatedValue.setValue(initialValue);
  };

  return {
    value: animatedValue,
    fadeIn,
    fadeOut,
    slideInBottom,
    slideInTop,
    scaleUp,
    scaleDown,
    bounce,
    shake,
    pulse,
    rotate,
    spring,
    setValue,
    reset,
  };
};

/**
 * Hook for fade-in animation on mount
 */
export const useFadeIn = (duration: number = 300, delay: number = 0) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [opacity, duration, delay]);

  return opacity;
};

/**
 * Hook for slide-in animation on mount
 */
export const useSlideIn = (
  from: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
  distance: number = 100,
  duration: number = 400
) => {
  const translateValue = useRef(new Animated.Value(from === 'top' || from === 'left' ? -distance : distance)).current;

  useEffect(() => {
    Animated.timing(translateValue, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  }, [translateValue, duration]);

  return {
    translateX: from === 'left' || from === 'right' ? translateValue : 0,
    translateY: from === 'top' || from === 'bottom' ? translateValue : 0,
  };
};

/**
 * Hook for scale animation on mount
 */
export const useScaleIn = (duration: number = 300, delay: number = 0) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [scale, duration, delay]);

  return scale;
};

/**
 * Hook for shimmer loading animation
 */
export const useShimmer = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = animationPresets.shimmer(shimmerValue);
    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmerValue]);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return { shimmerValue, translateX };
};

/**
 * Hook for pulse animation (looping)
 */
export const usePulse = (config?: { min?: number; max?: number; duration?: number }) => {
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = animationPresets.pulse(pulseValue, config);
    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulseValue]);

  return pulseValue;
};

/**
 * Hook for rotation animation
 */
export const useRotation = (duration: number = 1000, loop: boolean = true) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = loop
      ? Animated.loop(animationPresets.rotate360(rotateValue, { duration }))
      : animationPresets.rotate360(rotateValue, { duration });
    
    animation.start();

    return () => {
      animation.stop();
    };
  }, [rotateValue, duration, loop]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return rotate;
};

/**
 * Hook for stagger animation on list mount
 */
export const useStaggerAnimation = (itemCount: number, stagger: number = 100) => {
  const animatedValues = useRef(
    Array.from({ length: itemCount }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = animatedValues.map(value =>
      Animated.timing(value, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    );

    Animated.stagger(stagger, animations).start();
  }, [animatedValues, stagger]);

  return animatedValues;
};

/**
 * Hook for combined fade and scale animation
 */
export const useFadeScale = (duration: number = 300, delay: number = 0) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, duration, delay]);

  return { opacity, scale };
};

export default {
  useAnimation,
  useFadeIn,
  useSlideIn,
  useScaleIn,
  useShimmer,
  usePulse,
  useRotation,
  useStaggerAnimation,
  useFadeScale,
};
