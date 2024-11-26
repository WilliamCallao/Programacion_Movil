// components/FiltrosModal.js

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const FiltrosModal = ({ visible, onClose }) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    setScrollY(contentOffset.y);
  };

  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y <= 0 && scrollY <= 0) {
      onClose();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity }]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <MaterialCommunityIcons name="close" size={35} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}
        >
          {/* Contenido del modal de filtros. Por ahora está vacío. */}
          <Text style={styles.placeholderText}>Contenido de Filtros</Text>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  iconButton: {
    padding: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
});

export default FiltrosModal;
