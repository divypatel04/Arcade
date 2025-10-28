import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends TouchableOpacityProps {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`${size}Container`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      onPress={onPress}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
        />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Text
            style={[
              styles.text,
              styles[`${variant}Text`],
              styles[`${size}Text`],
              leftIcon ? styles.textWithLeftIcon : undefined,
              rightIcon ? styles.textWithRightIcon : undefined,
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon && rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: sizes.borderRadius.md,
    paddingHorizontal: sizes.lg,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: sizes.borderWidth.medium,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  danger: {
    backgroundColor: colors.error,
  },
  
  // Sizes - Container
  smContainer: {
    height: sizes.components.button.sm,
    paddingHorizontal: sizes.md,
  },
  mdContainer: {
    height: sizes.components.button.md,
    paddingHorizontal: sizes.lg,
  },
  lgContainer: {
    height: sizes.components.button.lg,
    paddingHorizontal: sizes.xl,
  },
  xlContainer: {
    height: sizes.components.button.xl,
    paddingHorizontal: sizes['2xl'],
  },
  
  // Text Styles
  text: {
    fontFamily: fonts.families.medium,
    fontWeight: fonts.weights.medium,
    letterSpacing: fonts.letterSpacing.wide,
  },
  
  // Variant Text Colors
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.white,
  },
  
  // Size Text
  smText: {
    fontSize: fonts.sizes.sm,
  },
  mdText: {
    fontSize: fonts.sizes.base,
  },
  lgText: {
    fontSize: fonts.sizes.md,
  },
  xlText: {
    fontSize: fonts.sizes.lg,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Icon spacing
  textWithLeftIcon: {
    marginLeft: sizes.sm,
  },
  textWithRightIcon: {
    marginRight: sizes.sm,
  },
});

export default Button;
