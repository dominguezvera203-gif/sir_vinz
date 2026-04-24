import { StyleSheet, View, Text } from 'react-native';

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const CardHeader = ({ title, description }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
    {description && <Text style={styles.description}>{description}</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    padding: 20,
    marginBottom: 20,
  },
  header: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', color: '#09090b' },
  description: { fontSize: 14, color: '#71717a', marginTop: 4 },
});