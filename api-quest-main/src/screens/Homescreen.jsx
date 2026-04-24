import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HomeHeader } from '../components/home/HomeHeader';
import { ApiCarousel } from '../components/home/ApiCarousel';
import { CategoryBento } from '../components/home/CategoryBento';
import { IntelligenceCard } from '../components/home/IntelligenceCard';
import { NewsDetailModal } from '../components/home/NewsDetailModal';
import { fetchApiData } from '../services/apiService';
import { SpinnerLoader } from '../components/ui/SpinnerLoader';

export default function HomeScreen({ navigation }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchApiData();
    setMissions(data);
    setLoading(false);
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <SpinnerLoader label="Loading feed..." />
      </View>
    );
  }

  // Carousel: first item per source
  const latestIdsBySource = new Map();
  missions.forEach((item) => {
    const key = item.source || item.id;
    if (!latestIdsBySource.has(key)) latestIdsBySource.set(key, item.id);
  });
  const carouselIds = new Set(latestIdsBySource.values());
  const carouselData = missions.filter((item) => carouselIds.has(item.id));
  const feedItems = missions.filter((item) => !carouselIds.has(item.id));

  const filteredFeed = activeFilter === 'all'
    ? feedItems
    : activeFilter === 'crypto'
    ? feedItems.filter((i) => i.source === 'crypto')
    : activeFilter === 'news'
    ? feedItems.filter((i) => i.source === 'news')
    : feedItems.filter((i) => i.category === activeFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* About Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={showAbout}
        onRequestClose={() => setShowAbout(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowAbout(false)}>
          <View style={styles.dialog}>
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>About</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowAbout(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="#52525b" />
              </TouchableOpacity>
            </View>
            <View style={styles.dialogDivider} />
            <Text style={styles.dialogBody}>
              This app aggregates live data from CoinGecko (crypto markets) and NewsData (global news). Data refreshes every 5 minutes.
            </Text>
            <View style={styles.dialogFooter}>
              <View style={styles.apiRow}>
                <Ionicons name="trending-up-outline" size={14} color="#16a34a" />
                <Text style={styles.apiLabel}>CoinGecko — Market data</Text>
              </View>
              <View style={styles.apiRow}>
                <Ionicons name="newspaper-outline" size={14} color="#2563eb" />
                <Text style={styles.apiLabel}>NewsData — Global news</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Detail Modal */}
      <NewsDetailModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedItem(null);
        }}
      />

      <View style={styles.mainWrapper}>
        <HomeHeader onHelpPress={() => setShowAbout(true)} />

        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
          <ApiCarousel
            data={carouselData}
            onItemPress={handleItemPress}
          />

          <CategoryBento
            activeFilter={activeFilter}
            onCategoryPress={setActiveFilter}
          />

          <View style={styles.feedSection}>
            <Text style={styles.sectionLabel}>
              {activeFilter === 'all' ? 'All Items' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              <Text style={styles.sectionCount}> · {filteredFeed.length}</Text>
            </Text>

            {filteredFeed.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={24} color="#a1a1aa" />
                <Text style={styles.emptyText}>No items in this category.</Text>
              </View>
            ) : (
              filteredFeed.map((item) => (
                <IntelligenceCard
                  key={item.id}
                  item={item}
                  onPress={() => handleItemPress(item)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mainWrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 16 : 2,
  },
  scrollBody: { flex: 1 },
  feedSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 48,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#09090b',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  sectionCount: {
    color: '#a1a1aa',
    fontWeight: '400',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#a1a1aa',
    fontFamily: 'Inter',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 32,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    overflow: 'hidden',
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#09090b',
    fontFamily: 'Inter',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  dialogDivider: { height: 1, backgroundColor: '#e4e4e7' },
  dialogBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    fontSize: 14,
    color: '#52525b',
    fontFamily: 'Inter',
    lineHeight: 22,
  },
  dialogFooter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  apiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  apiLabel: {
    fontSize: 13,
    color: '#3f3f46',
    fontFamily: 'Inter',
    fontWeight: '500',
  },
});