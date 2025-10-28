import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import { Icon } from '@components/common';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  label,
  disabled = false,
  error,
  size = 'md',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsVisible(false);
  };

  const sizeStyles = {
    sm: {
      minHeight: sizes.xl,
      fontSize: fonts.sizes.sm,
      paddingHorizontal: sizes.sm,
    },
    md: {
      minHeight: sizes['2xl'],
      fontSize: fonts.sizes.md,
      paddingHorizontal: sizes.md,
    },
    lg: {
      minHeight: sizes['3xl'],
      fontSize: fonts.sizes.lg,
      paddingHorizontal: sizes.lg,
    },
  };

  const currentSizeStyles = sizeStyles[size];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.trigger,
          {
            minHeight: currentSizeStyles.minHeight,
            paddingHorizontal: currentSizeStyles.paddingHorizontal,
          },
          disabled && styles.triggerDisabled,
          error && styles.triggerError,
        ]}
        onPress={() => !disabled && setIsVisible(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {selectedOption ? (
          <View style={styles.selectedContent}>
            {selectedOption.icon && (
              <Icon
                name={selectedOption.icon}
                size="sm"
                color={colors.textPrimary}
                style={styles.selectedIcon}
              />
            )}
            <Text
              style={[
                styles.selectedText,
                { fontSize: currentSizeStyles.fontSize },
              ]}
            >
              {selectedOption.label}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.placeholderText,
              { fontSize: currentSizeStyles.fontSize },
            ]}
          >
            {placeholder}
          </Text>
        )}
        <Icon
          name="chevron-down"
          size="sm"
          color={disabled ? colors.gray400 : colors.textSecondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {label || 'Select an option'}
                  </Text>
                  <TouchableOpacity onPress={() => setIsVisible(false)}>
                    <Icon name="close" size="md" color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.optionsList}
                  showsVerticalScrollIndicator={false}
                >
                  {options.map((option) => {
                    const isSelected = option.value === selectedValue;

                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.option,
                          isSelected && styles.optionSelected,
                        ]}
                        onPress={() => handleSelect(option.value)}
                        activeOpacity={0.7}
                      >
                        {option.icon && (
                          <Icon
                            name={option.icon}
                            size="md"
                            color={
                              isSelected ? colors.primary : colors.textPrimary
                            }
                            style={styles.optionIcon}
                          />
                        )}
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                        {isSelected && (
                          <Icon
                            name="check"
                            size="md"
                            color={colors.primary}
                            style={styles.checkIcon}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: sizes.borderRadius.md,
  },
  triggerDisabled: {
    backgroundColor: colors.gray100,
    opacity: 0.6,
  },
  triggerError: {
    borderColor: colors.error,
  },
  selectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedIcon: {
    marginRight: sizes.sm,
  },
  selectedText: {
    ...fonts.styles.body,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    flex: 1,
  },
  errorText: {
    ...fonts.styles.caption,
    color: colors.error,
    marginTop: sizes.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: sizes.lg,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: colors.background,
    borderRadius: sizes.borderRadius.lg,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: sizes.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    ...fonts.styles.h5,
    color: colors.textPrimary,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
    opacity: 0.1,
  },
  optionIcon: {
    marginRight: sizes.sm,
  },
  optionText: {
    ...fonts.styles.body,
    color: colors.textPrimary,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  checkIcon: {
    marginLeft: sizes.sm,
  },
});

export default Dropdown;
