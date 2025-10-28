import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import Button from './Button';
import Icon from './Icon';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Icon name={icon} size="3xl" color={colors.gray400} />
      
      <Text style={styles.title}>{title}</Text>
      
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
      
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="md"
          onPress={onAction}
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: sizes['3xl'],
  },
  title: {
    ...fonts.styles.h4,
    color: colors.textPrimary,
    marginTop: sizes.lg,
    textAlign: 'center',
  },
  description: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    marginTop: sizes.sm,
    textAlign: 'center',
    maxWidth: 300,
  },
  button: {
    marginTop: sizes.xl,
  },
});

export default EmptyState;
