import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Text,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';

export type LoadingSize = 'small' | 'large';

export interface LoadingProps {
  size?: LoadingSize;
  color?: string;
  fullScreen?: boolean;
  text?: string;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = colors.primary,
  fullScreen = false,
  text,
  style,
}) => {
  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: sizes.xl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  text: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    marginTop: sizes.md,
  },
});

export default Loading;
