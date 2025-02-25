import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { colors, fonts } from '../theme';

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
    // flex: 1, // Ensure the container fills the available space
    zIndex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
    flexGrow: 0, // Prevent tabs from stretching vertically
    zIndex: 1,
  },
  tabContainer: {
    borderColor: colors.black,
    flex: 1, // Distribute space equally among the tabs
    zIndex: 1,
  },
  tabInnerContainer: {
    paddingVertical: 12, // Reduced padding for smaller tab height
    paddingHorizontal: 16, // Adjusted padding for better layout
    borderColor: colors.black,
    zIndex: 1,
    // borderBottomWidth: 1,
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  tabText: {
    fontFamily: fonts.family.proximaBold,
    color: colors.darkGray,
    fontSize: 14,
    letterSpacing: -0.2,
    textTransform: 'capitalize',
    lineHeight: 20,
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
    // paddingVertical: 5,

    paddingHorizontal: 14,
  },
});
