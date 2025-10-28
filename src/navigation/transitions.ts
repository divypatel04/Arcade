import { TransitionPresets, StackNavigationOptions } from '@react-navigation/stack';
import { Easing } from 'react-native';

/**
 * Custom screen transition animations for React Navigation
 */

/**
 * Fade transition
 */
export const fadeTransition: StackNavigationOptions = {
  ...TransitionPresets.FadeFromBottomAndroid,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.out(Easing.ease),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.in(Easing.ease),
      },
    },
  },
};

/**
 * Slide from right (iOS style)
 */
export const slideFromRight: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200,
        easing: Easing.in(Easing.ease),
      },
    },
  },
};

/**
 * Slide from bottom (Android style)
 */
export const slideFromBottom: StackNavigationOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      },
    },
  },
};

/**
 * Scale from center
 */
export const scaleFromCenter: StackNavigationOptions = {
  headerShown: true,
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            }),
          },
        ],
        opacity: current.progress,
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.out(Easing.back(1.1)),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.in(Easing.ease),
      },
    },
  },
};

/**
 * Flip transition
 */
export const flipTransition: StackNavigationOptions = {
  headerShown: true,
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            rotateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: ['180deg', '0deg'],
            }),
          },
        ],
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 500,
        easing: Easing.out(Easing.ease),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 500,
        easing: Easing.in(Easing.ease),
      },
    },
  },
};

/**
 * Default transition based on platform
 */
export const defaultTransition: StackNavigationOptions = TransitionPresets.SlideFromRightIOS;

/**
 * Modal transition
 */
export const modalTransition: StackNavigationOptions = {
  ...TransitionPresets.ModalPresentationIOS,
  presentation: 'modal',
};

/**
 * Get transition based on screen name or type
 */
export const getScreenTransition = (
  screenName: string
): StackNavigationOptions => {
  // Modal screens
  if (screenName.includes('Modal') || screenName === 'Settings') {
    return modalTransition;
  }

  // Detail screens
  if (screenName.includes('Detail') || screenName.includes('Profile')) {
    return slideFromRight;
  }

  // Main tab screens
  if (['Home', 'Agents', 'Maps', 'Weapons', 'Profile'].includes(screenName)) {
    return fadeTransition;
  }

  // Default
  return defaultTransition;
};

export default {
  fadeTransition,
  slideFromRight,
  slideFromBottom,
  scaleFromCenter,
  flipTransition,
  defaultTransition,
  modalTransition,
  getScreenTransition,
};
