import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { colors, fonts, sizes } from '../theme';
import { Icon } from './lcon';
import { LanguageCode } from '../i18n';

interface LanguageSelectorProps {
  compact?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { t } = useTranslation();
  const { language, setLanguage, languageNames } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguageName = languageNames.find(item => item.code === language)?.name || '';

  const handleSelectLanguage = async (code: LanguageCode) => {
    await setLanguage(code);
    setModalVisible(false);
  };

  return (
    <View style={compact ? styles.compactContainer : styles.container}>
      <TouchableOpacity
        style={compact ? styles.compactSelector : styles.selector}
        onPress={() => setModalVisible(true)}>
        <Text style={compact ? styles.compactText : styles.text}>
          {compact ? currentLanguageName : t('settings.language') + ': ' + currentLanguageName}
        </Text>
        <Icon name="arrow-down-s-line" size={16} color={colors.darkGray} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close-line" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={languageNames}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    language === item.code && styles.selectedLanguageItem,
                  ]}
                  onPress={() => handleSelectLanguage(item.code)}>
                  <Text
                    style={[
                      styles.languageText,
                      language === item.code && styles.selectedLanguageText,
                    ]}>
                    {item.name}
                  </Text>
                  {language === item.code && (
                    <Icon name="check-line" size={20} color={colors.black} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: sizes.md,
  },
  compactContainer: {
    marginLeft: sizes.sm,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.xl,
    paddingVertical: sizes.lg,
    borderRadius: 4,
  },
  compactSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.md,
    color: colors.black,
    marginRight: sizes.sm,
  },
  compactText: {
    fontFamily: fonts.family.proximaBold,
    fontSize: fonts.sizes.sm,
    color: colors.darkGray,
    marginRight: sizes.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: sizes.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  modalTitle: {
    fontFamily: fonts.family.novecentoUltraBold,
    fontSize: fonts.sizes.xl,
    color: colors.black,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: sizes.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  selectedLanguageItem: {
    backgroundColor: colors.primary,
  },
  languageText: {
    fontFamily: fonts.family.proximaRegular,
    fontSize: fonts.sizes.md,
    color: colors.black,
  },
  selectedLanguageText: {
    fontFamily: fonts.family.proximaBold,
  },
});

export default LanguageSelector;
