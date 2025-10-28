import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Button, Icon } from '@components';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Track Your Stats',
    description:
      'View detailed statistics for all your Valorant matches, including K/D/A, win rates, and performance metrics.',
    icon: 'chart-line',
    iconColor: colors.primary,
  },
  {
    id: '2',
    title: 'Analyze Performance',
    description:
      'Get insights on your best agents, maps, and weapons. Identify strengths and areas for improvement.',
    icon: 'chart-bar',
    iconColor: colors.info,
  },
  {
    id: '3',
    title: 'Climb the Ranks',
    description:
      'Monitor your competitive progress, track rank changes, and achieve your goals with data-driven insights.',
    icon: 'trophy',
    iconColor: colors.warning,
  },
];

export const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to login/auth screen
      console.log('Navigate to auth');
    }
  };

  const skip = () => {
    slidesRef.current?.scrollToIndex({ index: slides.length - 1 });
  };

  const renderItem = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={120} color={item.iconColor} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const Paginator = () => {
    return (
      <View style={styles.paginatorContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={skip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slidesRef}
      />

      <Paginator />

      <View style={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          style={styles.button}
          onPress={scrollTo}
        >
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: sizes.xl,
  },
  skipButton: {
    padding: sizes.sm,
  },
  skipText: {
    ...fonts.styles.body,
    color: colors.textSecondary,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: sizes['2xl'],
  },
  iconContainer: {
    marginBottom: sizes['2xl'],
  },
  title: {
    ...fonts.styles.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: sizes.md,
  },
  description: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginHorizontal: 8,
  },
  footer: {
    paddingHorizontal: sizes.xl,
    paddingBottom: sizes['2xl'],
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen;
