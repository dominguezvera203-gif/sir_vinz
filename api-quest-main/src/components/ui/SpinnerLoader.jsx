import React, { useRef, useEffect } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

export function SpinnerLoader({ label = 'Loading...' }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  spinner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#e4e4e7',
    borderTopColor: '#18181b',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#71717a',
    fontFamily: 'Inter',
    letterSpacing: 0.1,
  },
});