import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HomeHeader = ({ onHelpPress }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.left}>
          <Text style={styles.brand}>Feed</Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={onHelpPress} activeOpacity={0.7}>
          <Ionicons name="information-circle-outline" size={20} color="#71717a" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 14,
  },
  left: {
    gap: 2,
  },
  brand: {
    fontSize: 22,
    fontWeight: '700',
    color: '#09090b',
    fontFamily: 'Inter',
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 12,
    color: '#71717a',
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e7',
  },
});