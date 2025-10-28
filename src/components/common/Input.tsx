import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, sizes, fonts } from '@theme';
import Icon from './Icon';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  size?: InputSize;
  clearable?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  size = 'md',
  clearable = false,
  leftIcon,
  rightIcon,
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  labelStyle,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (onChangeText) {
      onChangeText('');
    }
  };

  const hasError = !!error;
  const showClear = clearable && value && value.length > 0;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          styles[`${size}Container`],
          isFocused && styles.focused,
          hasError && styles.error,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            styles[`${size}Input`],
            leftIcon ? styles.inputWithLeftIcon : undefined,
            (rightIcon || showClear) ? styles.inputWithRightIcon : undefined,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.gray500}
          {...rest}
        />
        
        {showClear && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="close-circle" size="sm" color={colors.gray500} />
          </TouchableOpacity>
        )}
        
        {!showClear && rightIcon && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      
      {(error || hint) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error || hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: sizes.md,
  },
  label: {
    ...fonts.styles.label,
    color: colors.textPrimary,
    marginBottom: sizes.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: sizes.borderWidth.thin,
    borderColor: colors.border,
    borderRadius: sizes.borderRadius.md,
    paddingHorizontal: sizes.md,
  },
  smContainer: {
    height: sizes.components.input.sm,
  },
  mdContainer: {
    height: sizes.components.input.md,
  },
  lgContainer: {
    height: sizes.components.input.lg,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: sizes.borderWidth.medium,
  },
  error: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    ...fonts.styles.body,
    color: colors.textPrimary,
    padding: 0,
  },
  smInput: {
    fontSize: fonts.sizes.sm,
  },
  mdInput: {
    fontSize: fonts.sizes.base,
  },
  lgInput: {
    fontSize: fonts.sizes.md,
  },
  inputWithLeftIcon: {
    marginLeft: sizes.sm,
  },
  inputWithRightIcon: {
    marginRight: sizes.sm,
  },
  leftIcon: {
    marginRight: sizes.xs,
  },
  rightIcon: {
    marginLeft: sizes.xs,
  },
  clearButton: {
    padding: sizes.xs,
  },
  helperText: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
    marginLeft: sizes.sm,
  },
  errorText: {
    color: colors.error,
  },
});

export default Input;
