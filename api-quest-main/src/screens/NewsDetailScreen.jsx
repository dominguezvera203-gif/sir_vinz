import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SOURCE_CONFIG = {
  crypto: { label: 'Crypto', icon: 'trending-up-outline', color: '#16a34a', bg: '#f0fdf4' },
  news: { label: 'News', icon: 'newspaper-outline', color: '#2563eb', bg: '#eff6ff' },
  technology: { label: 'Technology', icon: 'hardware-chip-outline', color: '#7c3aed', bg: '#f5f3ff' },
  business: { label: 'Business', icon: 'briefcase-outline', color: '#b45309', bg: '#fffbeb' },
  system: { label: 'System', icon: 'alert-circle-outline', color: '#71717a', bg: '#f4f4f5' },
};

export default function NewsDetailScreen({ route }) {
  const item = route.params?.item;
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);

  const config = useMemo(() => {
    if (!item) return SOURCE_CONFIG['system'];
    if (item.source === 'crypto') return SOURCE_CONFIG['crypto'];
    if (item.category && SOURCE_CONFIG[item.category]) return SOURCE_CONFIG[item.category];
    return SOURCE_CONFIG['news'];
  }, [item]);

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.fallback}>
          <Ionicons name="alert-circle-outline" size={32} color="#a1a1aa" />
          <Text style={styles.fallbackText}>Item not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      {/* Back button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color="#09090b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.hero} resizeMode="cover" />
        ) : (
          <View style={styles.heroFallback}>
            <Ionicons name="image-outline" size={32} color="#a1a1aa" />
          </View>
        )}

        <View style={styles.body}>
          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon} size={13} color={config.color} />
            <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Meta row */}
          <View style={styles.metaRow}>
            {item.sourceId && (
              <>
                <Ionicons name="globe-outline" size={13} color="#a1a1aa" />
                <Text style={styles.metaText}>{item.sourceId}</Text>
                <View style={styles.dot} />
              </>
            )}
            <Ionicons name="time-outline" size={13} color="#a1a1aa" />
            <Text style={styles.metaText}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>Details</Text>
          <Text
            style={styles.desc}
            numberOfLines={expanded ? undefined : 6}
          >
            {item.desc}
          </Text>

          <TouchableOpacity
            style={styles.expandBtn}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandText}>{expanded ? 'Show less' : 'Read more'}</Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={15}
              color="#09090b"
            />
          </TouchableOpacity>

          {/* Crypto price panel */}
          {item.source === 'crypto' && item.price != null && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>Market Snapshot</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Price (USD)</Text>
                  <Text style={styles.statValue}>${item.price?.toLocaleString()}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>24h Change</Text>
                  <Text style={[
                    styles.statValue,
                    { color: item.change >= 0 ? '#16a34a' : '#dc2626' }
                  ]}>
                    {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)}%
                  </Text>
                </View>
                {item.symbol && (
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Symbol</Text>
                    <Text style={styles.statValue}>{item.symbol}</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  scroll: { flex: 1 },
  hero: {
    width: '100%',
    height: 200,
    backgroundColor: '#f4f4f5',
  },
  heroFallback: {
    width: '100%',
    height: 200,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#09090b',
    fontFamily: 'Inter',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#a1a1aa',
    fontFamily: 'Inter',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#d4d4d8',
    marginHorizontal: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f4f4f5',
    marginVertical: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#a1a1aa',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  desc: {
    fontSize: 15,
    color: '#3f3f46',
    fontFamily: 'Inter',
    lineHeight: 24,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: '#fafafa',
  },
  expandText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#09090b',
    fontFamily: 'Inter',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fafafa',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#a1a1aa',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#09090b',
    fontFamily: 'Inter',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  fallbackText: {
    fontSize: 14,
    color: '#71717a',
    fontFamily: 'Inter',
  },
});