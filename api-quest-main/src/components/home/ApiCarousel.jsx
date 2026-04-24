import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAutoCarousel } from '../../hooks/useAutoCarousel';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export const ApiCarousel = ({ data, onItemPress }) => {
  if (!data || data.length === 0) return null;

  const infiniteData = [data[data.length - 1], ...data, data[0]];
  const { flatListRef, handleMomentumScrollEnd } = useAutoCarousel(data);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.slide}
      activeOpacity={0.92}
      onPress={() => onItemPress?.(item)}
    >
      <View style={styles.card}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons name="image-outline" size={28} color="#a1a1aa" />
          </View>
        )}
        <View style={styles.body}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.source === 'crypto' ? 'Market' : 'News'}
              </Text>
            </View>
          </View>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.desc} numberOfLines={2}>{item.desc}</Text>
          <View style={styles.footer}>
            <Text style={styles.readMore}>Read more</Text>
            <Ionicons name="arrow-forward" size={14} color="#09090b" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={infiniteData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        initialScrollIndex={1}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `carousel-${index}`}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    paddingBottom: 4,
  },
  slide: {
    width,
    paddingHorizontal: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f4f4f5',
  },
  imageFallback: {
    width: '100%',
    height: 180,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: '#fafafa',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#52525b',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#09090b',
    fontFamily: 'Inter',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  desc: {
    fontSize: 13,
    color: '#71717a',
    fontFamily: 'Inter',
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  readMore: {
    fontSize: 13,
    fontWeight: '600',
    color: '#09090b',
    fontFamily: 'Inter',
  },
});