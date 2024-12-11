// components/TopTabs.js

import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const TAB_WIDTH = (width - 16)/ 2;

const TopTabs = ({ tabs, selectedTab, onTabPress }) => {
  const indicatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.key === selectedTab);
    Animated.spring(indicatorPosition, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      friction: 8,
      tension: 50,
    }).start();
  }, [selectedTab]);

  const renderTab = (tab, index) => {
    const isSelected = selectedTab === tab.key;
    return (
      <TouchableOpacity
        key={tab.key}
        style={styles.tab}
        onPress={() => onTabPress(tab.key)}
        activeOpacity={0.7}
        accessibilityLabel={tab.title}
      >
        <Text style={[styles.tabText, isSelected ? styles.tabTextSelected : styles.tabTextUnselected]}>
          {tab.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map(renderTab)}
      </View>
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [{ translateX: indicatorPosition }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#C7C6C6',
    position: 'relative',
    marginBottom: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  tab: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
  },
  tabTextSelected: {
    color: 'black',
    fontFamily: 'DMSans_500Medium',
  },
  tabTextUnselected: {
    color: '#A4A3A3',
    fontFamily: 'DMSans_400Regular',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '50%',
    backgroundColor: 'black',
  },
});

export default TopTabs;
