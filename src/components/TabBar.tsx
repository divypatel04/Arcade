import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { colors, fonts, sizes } from '../theme';

interface TabBarProps {
  tabs: { label: string; content: JSX.Element }[];
}

export default function TabBar({ tabs }: TabBarProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0].label);

  const onSelectTab = (tabLabel: string) => {
    setSelectedTab(tabLabel);
  };

  const renderTabContent = () => {
    const activeTab = tabs.find(tab => tab.label === selectedTab);
    return activeTab ? activeTab.content : null;
  };

  return (
    <View style={styles.container}>
      {/* Scrollable tabs area */}
      <ScrollView
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        contentContainerStyle={styles.scrollContentContainer}>
        {tabs.map(tab => (
          <View key={tab.label} style={styles.tabContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onSelectTab(tab.label)}>
              <View
                style={[
                  styles.tabInnerContainer,
                  selectedTab === tab.label && styles.selectedTab,
                ]}>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.label && styles.selectedTabText,
                  ]}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Scrollable content for the selected tab */}
      <ScrollView
        contentContainerStyle={[
          styles.tabContentScrollContainer,
          { flexGrow: renderTabContent() ? 0 : 1 }, // Adjust flexGrow if no content
        ]}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    zIndex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
    flexGrow: 0,
    zIndex: 1,
  },
  tabContainer: {
    borderColor: colors.black,
    flex: 1,
    zIndex: 1,
  },
  tabInnerContainer: {
    paddingVertical: sizes['2xl'],
    paddingHorizontal: sizes['4xl'],
    borderColor: colors.black,
    zIndex: 1,
    // borderBottomWidth: 1,
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  tabText: {
    fontFamily: fonts.family.proximaBold,
    color: colors.darkGray,
    fontSize: fonts.sizes.lg,
    letterSpacing: -0.2,
    textTransform: 'capitalize',
    lineHeight: fonts.sizes['3xl'],
    zIndex: 1,
  },
  selectedTab: {
    borderBottomWidth: 2,
    backgroundColor: colors.primary,
    opacity: 1,
  },
  selectedTabText: {
    color: colors.black,
  },
  tabContentScrollContainer: {
    paddingHorizontal: sizes['3xl'],
  },
});
