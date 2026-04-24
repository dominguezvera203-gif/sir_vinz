import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CategoryBento } from '../components/home/CategoryBento';
import { IntelligenceCard } from '../components/home/IntelligenceCard';
import { NewsDetailModal } from '../components/home/NewsDetailModal';
import { fetchApiData } from '../services/apiService';
import { SpinnerLoader } from '../components/ui/SpinnerLoader';

export default function NewsScreen({ route }) {
  const initialNews = Array.isArray(route.params?.newsItems) ? route.params.newsItems : [];
  const initialFilter = route.params?.initialFilter || 'all';

  const [newsItems, setNewsItems] = useState(initialNews);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [loading, setLoading] = useState(initialNews.length === 0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  React.useEffect(() => {
    if (initialNews.length > 0) return;
    const loadNews = async () => {
      const data = await fetchApiData();
      setNewsItems(data);
      setLoading(false);
    };
    loadNews();
  }, []);

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const filtered = useMemo(() => {
    let result = newsItems;
    if (activeFilter !== 'all') {
      if (activeFilter === 'crypto') result = result.filter((i) => i.source === 'crypto');
      else if (activeFilter === 'news') result = result.filter((i) => i.source === 'news');
      else result = result.filter((i) => i.category === activeFilter);
    }
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((i) =>
        (i.title || '').toLowerCase().includes(query) ||
        (i.desc || '').toLowerCase().includes(query)
      );
    }
    return result;
  }, [activeFilter, newsItems, search]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <NewsDetailModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedItem(null);
        }}
      />

      <View style={styles.wrapper}>
        {loading ? (
          <View style={styles.loading}>
            <SpinnerLoader label="Loading news..." />
          </View>
        ) : (
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <CategoryBento activeFilter={activeFilter} onCategoryPress={setActiveFilter} />

            <View style={styles.content}>
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={16} color="#a1a1aa" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor="#a1a1aa"
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color="#a1a1aa"
                    onPress={() => setSearch('')}
                  />
                )}
              </View>

              <Text style={styles.countLabel}>
                {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </Text>

              {filtered.length === 0 ? (
                <View style={styles.empty}>
                  <Ionicons name="search-outline" size={24} color="#a1a1aa" />
                  <Text style={styles.emptyText}>No results found.</Text>
                  <Text style={styles.emptySubtext}>Try a different keyword or category.</Text>
                </View>
              ) : (
                filtered.map((item) => (
                  <IntelligenceCard
                    key={item.id}
                    item={item}
                    enableExpand={false}
                    onPress={() => handleItemPress(item)}
                  />
                ))
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  wrapper: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#09090b',
    fontFamily: 'Inter',
  },
  countLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#a1a1aa',
    fontFamily: 'Inter',
    marginBottom: 14,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3f3f46',
    fontFamily: 'Inter',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#a1a1aa',
    fontFamily: 'Inter',
  },
});