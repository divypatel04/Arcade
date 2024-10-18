import React, {useState} from 'react';
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

export default function TabBar({tabs}: TabBarProps) {
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

      <View style={styles.tabContentContainer}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 5,
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  tabContainer: {
    borderColor: colors.black,
  },
  tabInnerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderColor: colors.black,
    zIndex:0,
  },
  tabText: {
    fontFamily: fonts.family.proximaBold,
    color: colors.darkGray,
    fontSize:14,
    letterSpacing: -0.2,
    textTransform: 'capitalize',
    lineHeight: 22,
  },
  selectedTab: {
    borderBottomWidth: 2,
    backgroundColor: colors.primary,
  },
  selectedTabText: {
    color: colors.black,
  },
  tabContentContainer: {
    marginVertical: 12,
    marginHorizontal: 14,
  },
});
