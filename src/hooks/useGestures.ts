import { useRef, useCallback } from 'react';
import { Animated, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';

/**
 * Hook for swipe gestures
 */
export const useSwipe = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { dx, dy } = gestureState;

        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > threshold && onSwipeRight) {
            onSwipeRight();
          } else if (dx < -threshold && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          // Vertical swipe
          if (dy > threshold && onSwipeDown) {
            onSwipeDown();
          } else if (dy < -threshold && onSwipeUp) {
            onSwipeUp();
          }
        }
      },
    })
  ).current;

  return panResponder.panHandlers;
};

/**
 * Hook for draggable component
 */
export const useDraggable = (
  onDragEnd?: (x: number, y: number) => void
) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        if (onDragEnd) {
          onDragEnd((pan.x as any)._value, (pan.y as any)._value);
        }
      },
    })
  ).current;

  const resetPosition = useCallback(() => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  }, [pan]);

  return {
    panHandlers: panResponder.panHandlers,
    pan,
    resetPosition,
  };
};

/**
 * Hook for pull to refresh gesture
 */
export const usePullToRefresh = (
  onRefresh: () => Promise<void>,
  threshold: number = 80
) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const isRefreshing = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0 && !isRefreshing.current) {
          translateY.setValue(Math.min(gestureState.dy, threshold * 1.5));
        }
      },
      onPanResponderRelease: async (_, gestureState) => {
        if (gestureState.dy >= threshold && !isRefreshing.current) {
          isRefreshing.current = true;
          
          Animated.timing(translateY, {
            toValue: threshold,
            duration: 200,
            useNativeDriver: true,
          }).start();

          await onRefresh();

          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            isRefreshing.current = false;
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return {
    panHandlers: panResponder.panHandlers,
    translateY,
  };
};

/**
 * Hook for long press gesture
 */
export const useLongPress = (
  onLongPress: () => void,
  delay: number = 500
) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressIn = useCallback(() => {
    timeout.current = setTimeout(() => {
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const handlePressOut = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  return {
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  };
};

/**
 * Hook for pinch to zoom gesture
 */
export const usePinchZoom = (
  minScale: number = 1,
  maxScale: number = 3
) => {
  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);

  const handlePinch = useCallback((event: any) => {
    const newScale = Math.max(minScale, Math.min(maxScale, lastScale.current * event.nativeEvent.scale));
    scale.setValue(newScale);
  }, [scale, minScale, maxScale]);

  const handlePinchEnd = useCallback(() => {
    lastScale.current = (scale as any)._value;
  }, [scale]);

  const resetZoom = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      lastScale.current = 1;
    });
  }, [scale]);

  return {
    scale,
    handlePinch,
    handlePinchEnd,
    resetZoom,
  };
};

/**
 * Hook for double tap gesture
 */
export const useDoubleTap = (
  onDoubleTap: () => void,
  delay: number = 300
) => {
  const lastTap = useRef<number | null>(null);

  const handlePress = useCallback(() => {
    const now = Date.now();
    
    if (lastTap.current && now - lastTap.current < delay) {
      onDoubleTap();
      lastTap.current = null;
    } else {
      lastTap.current = now;
    }
  }, [onDoubleTap, delay]);

  return {
    onPress: handlePress,
  };
};

/**
 * Hook for slide to delete gesture
 */
export const useSlideToDelete = (
  onDelete: () => void,
  threshold: number = 120
) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -threshold * 1.2));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -threshold) {
          Animated.timing(translateX, {
            toValue: -1000,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onDelete();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return {
    panHandlers: panResponder.panHandlers,
    translateX,
  };
};

export default {
  useSwipe,
  useDraggable,
  usePullToRefresh,
  useLongPress,
  usePinchZoom,
  useDoubleTap,
  useSlideToDelete,
};
