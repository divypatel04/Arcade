import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, sizes, fonts } from '@theme';
import { Modal, Button, Icon } from '@components/common';

export interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onWatchAd?: () => void;
  onBuyPremium: () => void;
  featureName?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  onWatchAd,
  onBuyPremium,
  featureName = 'this content',
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      closeOnBackdropPress={true}
      contentStyle={styles.modalContent}
    >
      <View style={styles.iconContainer}>
        <Icon name="crown" size="3xl" color={colors.premium} />
      </View>

      <Text style={styles.title}>Premium Feature</Text>

      <Text style={styles.description}>
        Unlock {featureName} with Premium or watch an ad to view it temporarily.
      </Text>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Icon name="check-circle" size="sm" color={colors.success} />
          <Text style={styles.featureText}>Unlimited access to all stats</Text>
        </View>
        <View style={styles.feature}>
          <Icon name="check-circle" size="sm" color={colors.success} />
          <Text style={styles.featureText}>No ads</Text>
        </View>
        <View style={styles.feature}>
          <Icon name="check-circle" size="sm" color={colors.success} />
          <Text style={styles.featureText}>Advanced analytics</Text>
        </View>
        <View style={styles.feature}>
          <Icon name="check-circle" size="sm" color={colors.success} />
          <Text style={styles.featureText}>Match history details</Text>
        </View>
      </View>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onPress={onBuyPremium}
        style={styles.premiumButton}
      >
        Get Premium
      </Button>

      {onWatchAd && (
        <Button
          variant="outline"
          size="md"
          fullWidth
          onPress={onWatchAd}
          style={styles.adButton}
        >
          Watch Ad to Unlock
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        fullWidth
        onPress={onClose}
        style={styles.closeButton}
      >
        Maybe Later
      </Button>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: sizes.borderRadius.full,
    backgroundColor: `${colors.premium}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sizes.lg,
  },
  title: {
    ...fonts.styles.h4,
    color: colors.textPrimary,
    marginBottom: sizes.sm,
  },
  description: {
    ...fonts.styles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: sizes.xl,
  },
  features: {
    width: '100%',
    marginBottom: sizes.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.sm,
  },
  featureText: {
    ...fonts.styles.body,
    color: colors.textPrimary,
    marginLeft: sizes.sm,
  },
  premiumButton: {
    backgroundColor: colors.premium,
    marginBottom: sizes.md,
  },
  adButton: {
    marginBottom: sizes.sm,
  },
  closeButton: {
    marginTop: sizes.xs,
  },
});

export default PremiumModal;
