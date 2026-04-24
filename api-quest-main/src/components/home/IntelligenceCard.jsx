import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SOURCE_CONFIG = {
  'news': { label: 'News', icon: 'newspaper-outline', color: '#2563eb' },
  'crypto': { label: 'Crypto', icon: 'trending-up-outline', color: '#16a34a' },
  'technology': { label: 'Tech', icon: 'hardware-chip-outline', color: '#7c3aed' },
  'business': { label: 'Business', icon: 'briefcase-outline', color: '#b45309' },
  'system': { label: 'System', icon: 'alert-circle-outline', color: '#71717a' },
};

const getConfig = (item) => {
  if (item.source === 'crypto') return SOURCE_CONFIG['crypto'];
  if (item.category) return SOURCE_CONFIG[item.category] || SOURCE_CONFIG['news'];
  return SOURCE_CONFIG['news'];
};

export const IntelligenceCard = ({ item, onPress, enableExpand = true }) => {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const config = getConfig(item);
  const isCrypto = item.source === 'crypto';
  const isUp = item.change >= 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={[styles.iconBox, { backgroundColor: `${config.color}12` }]}>
            <Ionicons name={config.icon} size={13} color={config.color} />
          </View>
          <Text style={[styles.badgeLabel, { color: config.color }]}>{config.label}</Text>
        </View>

        {isCrypto && item.change != null && (
          <View style={[styles.changePill, { backgroundColor: isUp ? '#dcfce7' : '#fee2e2' }]}>
            <Ionicons
              name={isUp ? 'caret-up' : 'caret-down'}
              size={10}
              color={isUp ? '#16a34a' : '#dc2626'}
            />
            <Text style={[styles.changeText, { color: isUp ? '#16a34a' : '#dc2626' }]}>
              {Math.abs(item.change).toFixed(2)}%
            </Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Description */}
      <Text
        style={styles.desc}
        numberOfLines={enableExpand && !expanded ? 3 : undefined}
        onTextLayout={({ nativeEvent }) => {
          if (nativeEvent.lines.length > 3) setHasOverflow(true);
        }}
      >
        {item.desc}
      </Text>

      {enableExpand && hasOverflow && (
        <TouchableOpacity
          style={styles.expandBtn}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandText}>{expanded ? 'Show less' : 'Read more'}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={13} color="#52525b" />
        </TouchableOpacity>
      )}

      {/* Footer */}
      <View style={styles.divider} />
      <View style={styles.footer}>
        {item.sourceId ? (
          <Text style={styles.footerMeta}>{item.sourceId}</Text>
        ) : (
          <Text style={styles.footerMeta}>Market data</Text>
        )}
        <View style={styles.arrowHint}>
          <Ionicons name="arrow-forward-outline" size={13} color="#a1a1aa" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#09090b',
    fontFamily: 'Inter',
    letterSpacing: -0.2,
    lineHeight: 22,
    marginBottom: 6,
  },
  desc: {
    fontSize: 14,
    color: '#52525b',
    fontFamily: 'Inter',
    lineHeight: 21,
    marginBottom: 10,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  expandText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52525b',
    fontFamily: 'Inter',
  },
  divider: {
    height: 1,
    backgroundColor: '#f4f4f5',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerMeta: {
    fontSize: 12,
    color: '#a1a1aa',
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  arrowHint: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});