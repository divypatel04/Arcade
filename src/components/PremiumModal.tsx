import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts, sizes } from '../theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useTranslation } from 'react-i18next';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  onBuyPremium: () => void;
}

const PremiumModal = ({ visible, onClose, onWatchAd, onBuyPremium }: PremiumModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={20} color={colors.darkGray} />
          </TouchableOpacity>

          <FontAwesome name="star" size={50} color={colors.win} style={styles.icon} />

          <Text style={styles.title}>{t('premium.notPremiumUser')}</Text>
          <Text style={styles.subtitle}>{t('premium.accessPremiumFeatures')}</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.adButton} onPress={onWatchAd}>
              <FontAwesome name="play" size={14} color={colors.black} style={styles.buttonIcon} />
              <Text style={styles.adButtonText}>{t('premium.watchAd')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.premiumButton} onPress={onBuyPremium}>
              <FontAwesome name="star" size={14} color={colors.white} style={styles.buttonIcon} />
              <Text style={styles.premiumButtonText}>{t('premium.buyPremium')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    backgroundColor: colors.white,
    padding: sizes['2xl'],
    paddingVertical: sizes['6xl'],
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: sizes.md,
    right: sizes.md,
    padding: sizes.sm,
  },
  icon: {
    marginVertical: sizes.xl,
  },
  title: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['5xl'],
    textTransform:'lowercase',
    color: colors.black,
    textAlign: 'center',
    marginBottom: sizes.md,
  },
  subtitle: {
    fontFamily: fonts.family.novecentoSemibold,
    fontSize: fonts.sizes.lg,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: sizes['4xl'],
  },
  optionsContainer: {
    width: '100%',
    gap: sizes.lg,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  adButton: {
    backgroundColor: colors.primary,
    paddingVertical: sizes['2xl'],
    paddingHorizontal: sizes['4xl'],
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumButton: {
    backgroundColor: colors.win,
    paddingVertical: sizes['2xl'],
    paddingHorizontal: sizes['4xl'],
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',

    alignItems: 'center',
  },
  adButtonText: {
    fontFamily: fonts.family.novecentoBold,
    color: colors.black,
    fontSize: fonts.sizes['2xl'],
    textTransform:'lowercase',
    lineHeight: sizes['4xl'],
  },
  premiumButtonText: {
    fontFamily: fonts.family.novecentoBold,
    color: colors.white,
    fontSize: fonts.sizes['2xl'],
    textTransform:'lowercase',
    lineHeight: sizes['4xl'],
  },
  buttonIcon: {
    marginRight: sizes.md,
  }
});

export default PremiumModal;
