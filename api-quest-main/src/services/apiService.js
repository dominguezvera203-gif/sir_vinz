import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'api_quest_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const fetchWithTimeout = (url, ms = 5000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
};

const loadCache = async () => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL) return data;
    return null;
  } catch {
    return null;
  }
};

const saveCache = async (data) => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
};

export const fetchApiData = async () => {
  // Return cache immediately if fresh
  const cached = await loadCache();
  if (cached) return cached;

  try {
    const NEWS_KEY = process.env.EXPO_PUBLIC_NEWSDATA_API_KEY;

    const [cryptoRes, newsRes] = await Promise.allSettled([
      fetchWithTimeout(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=24h',
        6000
      ),
      fetchWithTimeout(
        `https://newsdata.io/api/1/latest?apikey=${NEWS_KEY}&language=en&category=technology,business&size=5`,
        8000
      ),
    ]);

    const apiData = [];

    // Crypto
    if (cryptoRes.status === 'fulfilled' && cryptoRes.value.ok) {
      const cryptoData = await cryptoRes.value.json();
      if (Array.isArray(cryptoData)) {
        cryptoData.forEach((coin) => {
          const changeVal = coin.price_change_percentage_24h ?? 0;
          apiData.push({
            id: `crypto-${coin.id}`,
            title: `${coin.name} (${coin.symbol?.toUpperCase()})`,
            desc: `Trading at $${coin.current_price?.toLocaleString()}. 24h change: ${changeVal >= 0 ? '+' : ''}${changeVal.toFixed(2)}%. Market cap: $${(coin.market_cap / 1e9).toFixed(2)}B.`,
            image: coin.image || null,
            status: 'success',
            source: 'crypto',
            price: coin.current_price,
            change: changeVal,
            symbol: coin.symbol?.toUpperCase(),
          });
        });
      }
    }

    // News
    if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
      const newsData = await newsRes.value.json();
      const results = newsData?.results || [];
      results.forEach((article, index) => {
        apiData.push({
          id: `news-${article.article_id || index}`,
          title: article.title || 'Breaking News',
          desc: article.description || 'No description available.',
          image: article.image_url || null,
          status: 'success',
          source: 'news',
          category: article.category?.[0] || 'general',
          pubDate: article.pubDate || null,
          sourceId: article.source_id || null,
        });
      });
    }

    // Fallback if both failed
    if (apiData.length === 0) {
      return [{
        id: 'err',
        title: 'No data available',
        desc: 'Could not fetch data. Pull to refresh.',
        image: null,
        status: 'error',
        source: 'system',
      }];
    }

    await saveCache(apiData);
    return apiData;

  } catch (error) {
    console.error('API Sync Error:', error);

    // Return stale cache if available even if expired
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (raw) {
        const { data } = JSON.parse(raw);
        return data;
      }
    } catch {}

    return [{
      id: 'err',
      title: 'Connection failed',
      desc: 'Check your internet and try again.',
      image: null,
      status: 'error',
      source: 'system',
    }];
  }
};

export const clearCache = async () => {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
  } catch {}
};