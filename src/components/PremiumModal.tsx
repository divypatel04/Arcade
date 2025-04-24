import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { colors, fonts, sizes } from '../theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useTranslation } from 'react-i18next';
import { useRewardedAd } from '../hooks/useRewardedAd';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  onBuyPremium: () => void;
}

const PremiumModal = ({ visible, onClose, onWatchAd, onBuyPremium }: PremiumModalProps) => {
  const { t } = useTranslation();
  const { showRewardedAd, isRewardedAdReady } = useRewardedAd();
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  const handleWatchAd = () => {
    setIsLoadingAd(true);

    if (isRewardedAdReady) {
      showRewardedAd(
        // Called when user earns a reward
        (reward: any) => {
          console.log('User earned reward of', reward);
          setIsLoadingAd(false);
          onClose();
          onWatchAd(); // This will navigate to the premium content
        },
        // Called when ad is dismissed without reward
        () => {
          console.log('Ad closed without reward');
          setIsLoadingAd(false);
        }
      );
    } else {
      console.log('Rewarded ad not ready yet');
      setIsLoadingAd(false);
      // Optionally show a message to the user
    }
  };

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
            <FontAwesome name="xmark" size={20} color={colors.darkGray} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <FontAwesome name="crown" size={40} color={colors.win} style={styles.icon} />
          </View>

          <Text style={styles.title}>{t('premium.notPremiumUser')}</Text>
          <Text style={styles.subtitle}>{t('premium.accessPremiumFeatures')}</Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <FontAwesome name="check" size={16} color={colors.win} style={styles.featureIcon} />
              <Text style={styles.featureText}>No ads</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="check" size={16} color={colors.win} style={styles.featureIcon} />
              <Text style={styles.featureText}>Exclusive games</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="check" size={16} color={colors.win} style={styles.featureIcon} />
              <Text style={styles.featureText}>Early access</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.adButton}
              onPress={handleWatchAd}
              disabled={isLoadingAd || !isRewardedAdReady}
            >
              {isLoadingAd ? (
                <ActivityIndicator size="small" color={colors.black} />
              ) : (
                <>
                  <FontAwesome name="play" size={14} color={colors.black} style={styles.buttonIcon} />
                  <Text style={styles.adButtonText}>{t('premium.watchAd')}</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.premiumButton} onPress={onBuyPremium}>
              <FontAwesome name="crown" size={14} color={colors.white} style={styles.buttonIcon} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: sizes['3xl'],
    paddingVertical: sizes['4xl'],
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: sizes.lg,
    right: sizes.lg,
    padding: sizes.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.xl,
    marginTop: sizes.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  icon: {
    marginVertical: sizes.sm,
  },
  title: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes['5xl'],
    textTransform: 'lowercase',
    color: colors.black,
    textAlign: 'center',
    marginBottom: sizes.md,
  },
  subtitle: {
    fontFamily: fonts.family.novecentoSemibold,
    fontSize: fonts.sizes.lg,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: sizes['2xl'],
    maxWidth: '90%',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: sizes['3xl'],
    paddingHorizontal: sizes.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.xs,
  },
  featureIcon: {
    marginRight: sizes.lg,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: sizes.md,
    borderRadius: 50,
  },
  featureText: {
    fontFamily: fonts.family.novecentoSemibold,
    fontSize: fonts.sizes.lg,
    color: colors.black,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: sizes.lg,
    paddingHorizontal: sizes.sm,
  },
  adButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: sizes.xl,
    paddingHorizontal: sizes.md,
    marginRight: sizes.md,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  premiumButton: {
    flex: 1,
    backgroundColor: colors.win,
    paddingVertical: sizes.xl,
    paddingHorizontal: sizes.md,
    marginLeft: sizes.md,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.win,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  adButtonText: {
    fontFamily: fonts.family.novecentoBold,
    color: colors.black,
    fontSize: fonts.sizes['2xl'],
    textTransform: 'lowercase',
  },
  premiumButtonText: {
    fontFamily: fonts.family.novecentoBold,
    color: colors.white,
    fontSize: fonts.sizes['2xl'],
    textTransform: 'lowercase',
  },
  buttonIcon: {
    marginRight: sizes.md,
  }
});

export default PremiumModal;
