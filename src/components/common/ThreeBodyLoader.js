// ThreeBodyLoader.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const ThreeBodyLoader = () => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [anim]);

  const spin = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const amplitude = 10;

  const wobble1 = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -amplitude, 0],
  });

  const anim2 = Animated.modulo(Animated.add(anim, 0.3333), 1);

  const wobble2 = anim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -amplitude, 0],
  });

  const anim3 = Animated.modulo(Animated.add(anim, 0.6666), 1);

  const wobble3 = anim3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -amplitude, 0],
  });

  const opacity1 = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1, 0.8],
  });

  const opacity2 = anim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1, 0.8],
  });

  const opacity3 = anim3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1, 0.8],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ rotate: spin }] }]}>
      <Animated.View
        style={[
          styles.dot,
          styles.dot1,
          {
            transform: [{ translateY: wobble1 }],
            opacity: opacity1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          styles.dot2,
          {
            transform: [{ translateY: wobble2 }],
            opacity: opacity2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          styles.dot3,
          {
            transform: [{ translateY: wobble3 }],
            opacity: opacity3,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 35,
    height: 35,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: '30%',
    aspectRatio: 1,
    backgroundColor: 'black',
    borderRadius: 50,
  },
  dot1: {
    bottom: '5%',
    left: 0,
  },
  dot2: {
    bottom: '5%',
    right: 0,
  },
  dot3: {
    bottom: '-5%',
    left: '35%',
  },
});

export default ThreeBodyLoader;
