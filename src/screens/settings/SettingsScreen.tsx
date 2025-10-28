import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { colors, sizes, fonts, shadows } from '@theme';
import { Icon, Button, Card } from '@components';

interface SettingItem {
  id: string;
  label: string;
  icon: string;
  subtitle?: string;
  toggle?: boolean;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
}

interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

export const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoRefresh, setAutoRefresh] = React.useState(false);

  const settingsItems: SettingSection[] = [
    {
      id: '1',
      title: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Edit Profile',
          icon: 'account-edit',
          onPress: () => console.log('Edit profile'),
        },
        {
          id: 'riot-account',
          label: 'Riot Account',
          icon: 'link',
          subtitle: 'PlayerName#NA1',
          onPress: () => console.log('Riot account'),
        },
        {
          id: 'privacy',
          label: 'Privacy',
          icon: 'shield-lock',
          onPress: () => console.log('Privacy'),
        },
      ],
    },
    {
      id: '2',
      title: 'App Settings',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          icon: 'bell',
          toggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          id: 'auto-refresh',
          label: 'Auto Refresh Stats',
          icon: 'refresh',
          toggle: true,
          value: autoRefresh,
          onToggle: setAutoRefresh,
        },
        {
          id: 'theme',
          label: 'Theme',
          icon: 'palette',
          subtitle: 'Dark',
          onPress: () => console.log('Theme'),
        },
      ],
    },
    {
      id: '3',
      title: 'Premium',
      items: [
        {
          id: 'subscription',
          label: 'Manage Subscription',
          icon: 'crown',
          onPress: () => console.log('Subscription'),
        },
        {
          id: 'restore',
          label: 'Restore Purchases',
          icon: 'backup-restore',
          onPress: () => console.log('Restore purchases'),
        },
      ],
    },
    {
      id: '4',
      title: 'Support',
      items: [
        {
          id: 'help',
          label: 'Help Center',
          icon: 'help-circle',
          onPress: () => console.log('Help'),
        },
        {
          id: 'feedback',
          label: 'Send Feedback',
          icon: 'message-text',
          onPress: () => console.log('Feedback'),
        },
        {
          id: 'rate',
          label: 'Rate App',
          icon: 'star',
          onPress: () => console.log('Rate app'),
        },
      ],
    },
    {
      id: '5',
      title: 'Legal',
      items: [
        {
          id: 'terms',
          label: 'Terms of Service',
          icon: 'file-document',
          onPress: () => console.log('Terms'),
        },
        {
          id: 'privacy-policy',
          label: 'Privacy Policy',
          icon: 'shield-account',
          onPress: () => console.log('Privacy policy'),
        },
        {
          id: 'licenses',
          label: 'Open Source Licenses',
          icon: 'license',
          onPress: () => console.log('Licenses'),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsItems.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card elevation="sm" style={styles.card}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    index !== section.items.length - 1 && styles.settingItemBorder,
                  ]}
                  onPress={item.toggle ? undefined : item.onPress}
                  disabled={item.toggle}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <Icon name={item.icon} size="md" color={colors.textSecondary} />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      {item.subtitle && (
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.gray300, true: colors.primary }}
                      thumbColor={colors.white}
                    />
                  ) : (
                    <Icon name="chevron-right" size="sm" color={colors.gray400} />
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.dangerZone}>
          <Button variant="danger" size="md">
            Sign Out
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2025 Arcade Stats</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: sizes.lg,
    paddingTop: sizes.xl,
    paddingBottom: sizes.md,
  },
  title: {
    ...fonts.styles.h3,
    color: colors.textPrimary,
  },
  section: {
    paddingHorizontal: sizes.lg,
    paddingTop: sizes.md,
  },
  sectionTitle: {
    ...fonts.styles.label,
    color: colors.textSecondary,
    marginBottom: sizes.sm,
    textTransform: 'uppercase',
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: sizes.md,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: sizes.md,
    flex: 1,
  },
  settingLabel: {
    ...fonts.styles.body,
    color: colors.textPrimary,
  },
  settingSubtitle: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  dangerZone: {
    paddingHorizontal: sizes.lg,
    paddingVertical: sizes.xl,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: sizes.xl,
  },
  version: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
  },
  copyright: {
    ...fonts.styles.caption,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
});

export default SettingsScreen;
