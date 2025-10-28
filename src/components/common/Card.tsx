import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, sizes, shadows } from '@theme';

export type CardElevation = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  elevation?: CardElevation;
  pressable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'sm',
  pressable = false,
  style,
  contentStyle,
  onPress,
  ...rest
}) => {
  const cardStyle = [
    styles.base,
    shadows[elevation],
    style,
  ];

  const content = (
    <View style={[styles.content, contentStyle]}>
      {children}
    </View>
  );

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        activeOpacity={0.8}
        onPress={onPress}
        {...rest}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: sizes.lg,
  },
});

export default Card;
