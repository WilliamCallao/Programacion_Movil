import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 4;

const BottomNavbar = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const translateX = useSharedValue(0);
  const navigation = useNavigation();

  const menuItems = [
    { icon: 'assignment', label: 'Mi plan', screen: 'PlanScreen' },
    { icon: 'restaurant', label: 'Recetas', screen: 'RecipesScreen' },
    { icon: 'timeline', label: 'Progreso', screen: 'ProgressScreen' },
    { icon: 'person', label: 'Perfil', screen: 'ProfileScreen' },
  ];

  useEffect(() => {
    translateX.value = withSpring(selectedItem * ITEM_WIDTH, {
      damping: 20,
      stiffness: 90,
    });
  }, [selectedItem]);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#FFFFFF');
    NavigationBar.setButtonStyleAsync('dark');
  }, []);

  const handlePress = (index, screen) => {
    setSelectedItem(index);
    navigation.navigate(screen);
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderItem = (item, index) => {
    const isSelected = selectedItem === index;
    return (
      <TouchableOpacity
        key={index}
        style={styles.iconBox}
        onPress={() => handlePress(index, item.screen)}
        activeOpacity={0.7}
        accessibilityLabel={item.label}
      >
        <Icon
          name={item.icon}
          size={20}
          color={isSelected ? '#007AFF' : '#8E8E93'}
          style={isSelected ? styles.selectedIcon : styles.icon}
        />
        <Text
          style={[
            styles.label,
            { color: isSelected ? '#007AFF' : '#8E8E93' },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
        {menuItems.map(renderItem)}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#C6C6C8',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: ITEM_WIDTH,
    backgroundColor: '#007AFF',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  selectedIcon: {
    transform: [{ scale: 1.1 }],
  },
  icon: {},
});

export default BottomNavbar;