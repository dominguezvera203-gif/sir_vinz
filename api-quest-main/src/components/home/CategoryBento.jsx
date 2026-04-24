import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

const CATEGORIES = [
  { label: 'All', filterKey: 'all' },
  { label: 'News', filterKey: 'news' },
  { label: 'Crypto', filterKey: 'crypto' },
  { label: 'Technology', filterKey: 'technology' },
  { label: 'Business', filterKey: 'business' },
];

export const CategoryBento = ({ onCategoryPress, activeFilter = 'all' }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat.filterKey;
          return (
            <TouchableOpacity
              key={cat.filterKey}
              style={[styles.tab, isActive && styles.tabActive]}
              activeOpacity={0.75}
              onPress={() => onCategoryPress?.(cat.filterKey)}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: '#fff',
  },
  tabActive: {
    backgroundColor: '#09090b',
    borderColor: '#09090b',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52525b',
    fontFamily: 'Inter',
  },
  tabLabelActive: {
    color: '#fafafa',
    fontWeight: '600',
  },
});