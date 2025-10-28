import { Animated, Easing } from 'react-native';

/**
 * Animation presets and helpers
 */

export interface AnimationConfig {
  duration: number;
  easing: (value: number) => number;
  useNativeDriver?: boolean;
}

/**
 * Default animation configs
 */
export const animationConfigs = {
  fast: {
    duration: 200,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  },
  normal: {
    duration: 300,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  },
  slow: {
    duration: 500,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  },
  spring: {
    tension: 40,
    friction: 7,
    useNativeDriver: true,
  },
};

/**
 * Fade In Animation
 */
export const fadeIn = (
  animatedValue: Animated.Value,
  config: Partial<AnimationConfig> = {}
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration: config.duration || 300,
    easing: config.easing || Easing.out(Easing.ease),
    useNativeDriver: config.useNativeDriver !== false,
  });
};

/**
 * Fade Out Animation
 */
export const fadeOut = (
  animatedValue: Animated.Value,
  config: Partial<AnimationConfig> = {}
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration: config.duration || 300,
    easing: config.easing || Easing.in(Easing.ease),
    useNativeDriver: config.useNativeDriver !== false,
  });
};

/**
 * Slide In from Bottom
 */
export const slideInBottom = (
  animatedValue: Animated.Value,
  config: Partial<AnimationConfig> = {}
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration: config.duration || 400,
    easing: config.easing || Easing.out(Easing.cubic),
    useNativeDriver: config.useNativeDriver !== false,
  });
};

/**
 * Slide In from Top
 */
export const slideInTop = (
  animatedValue: Animated.Value,
  config: Partial<AnimationConfig> = {}
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration: config.duration || 400,
    easing: config.easing || Easing.out(Easing.cubic),
    useNativeDriver: config.useNativeDriver !== false,
  });
};

/**
 * Slide Out to Bottom
 */
export const slideOutBottom = (
  animatedValue: Animated.Value,
  distance: number = 100,
  config: Partial<AnimationConfig> = {}
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: distance,
    duration: config.duration || 300,
    easing: config.easing || Easing.in(Easing.cubic),
    useNativeDriver: config.useNativeDriver !== false,
  });
};

/**
 * Scale Up Animation
 */
export const scaleUp = (
  animatedValue: Animated.Value,
  config: Partial<AnimationConfig> = {}
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration: config.duration || 300,
    easing: config.easing || Easing.out(Easing.back(1.5)),
    useNativeDriver: config.useNativeDriver !== false,
  });
};

/**
 * Scale Down Animation
 */
export const scaleDown = (
  animatedValue: Animated.Value,
  config: Partial<AnimationConfig> = {}
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration: config.duration || 200,
    easing: config.easing || Easing.in(Easing.ease),
    useNativeDriver: config.useNativeDriver !== false,
  });
};

/**
 * Bounce Animation
 */
export const bounce = (
  animatedValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.2,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0.9,
      duration: 100,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Shake Animation
 */
export const shake = (
  animatedValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(animatedValue, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(animatedValue, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(animatedValue, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(animatedValue, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]);
};

/**
 * Pulse Animation (looping)
 */
export const pulse = (
  animatedValue: Animated.Value,
  config: { min?: number; max?: number; duration?: number } = {}
): Animated.CompositeAnimation => {
  const { min = 0.95, max = 1.05, duration = 1000 } = config;
  
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: max,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: min,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Rotate Animation (360 degrees)
 */
export const rotate360 = (
  animatedValue: Animated.Value,
  config: Partial<AnimationConfig> = {}
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration: config.duration || 1000,
    easing: config.easing || Easing.linear,
    useNativeDriver: config.useNativeDriver !== false,
  });
};

/**
 * Shimmer Animation (for loading states)
 */
export const shimmer = (
  animatedValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Stagger Animation (for lists)
 */
export const staggerAnimation = (
  animations: Animated.CompositeAnimation[],
  stagger: number = 100
): Animated.CompositeAnimation => {
  return Animated.stagger(stagger, animations);
};

/**
 * Parallel Animation
 */
export const parallelAnimation = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.parallel(animations);
};

/**
 * Sequential Animation
 */
export const sequenceAnimation = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.sequence(animations);
};

/**
 * Spring Animation
 */
export const springAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  config: { tension?: number; friction?: number } = {}
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue,
    tension: config.tension || 40,
    friction: config.friction || 7,
    useNativeDriver: true,
  });
};

/**
 * Success Animation (scale + fade)
 */
export const successAnimation = (
  scale: Animated.Value,
  opacity: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.parallel([
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]),
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Error Animation (shake + color pulse)
 */
export const errorAnimation = (
  translateX: Animated.Value
): Animated.CompositeAnimation => {
  return shake(translateX);
};

/**
 * Create fade-in stagger for list items
 */
export const createListItemAnimation = (
  index: number,
  opacity: Animated.Value,
  translateY: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.parallel([
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      delay: index * 50,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
  ]);
};

export default {
  animationConfigs,
  fadeIn,
  fadeOut,
  slideInBottom,
  slideInTop,
  slideOutBottom,
  scaleUp,
  scaleDown,
  bounce,
  shake,
  pulse,
  rotate360,
  shimmer,
  staggerAnimation,
  parallelAnimation,
  sequenceAnimation,
  springAnimation,
  successAnimation,
  errorAnimation,
  createListItemAnimation,
};
