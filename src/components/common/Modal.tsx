import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ModalProps as RNModalProps,
  ViewStyle,
} from 'react-native';
import { colors, sizes, shadows } from '@theme';

export interface ModalProps extends RNModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdropPress?: boolean;
  backdropOpacity?: number;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  closeOnBackdropPress = true,
  backdropOpacity = 0.5,
  contentStyle,
  animationType = 'slide',
  ...rest
}) => {
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
      {...rest}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={[styles.backdrop, { backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})` }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, contentStyle]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: sizes.xl,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: sizes.borderRadius.xl,
    padding: sizes.xl,
    maxWidth: 400,
    width: '100%',
    ...shadows.xl,
  },
});

export default Modal;
