import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ApiInfo = ({ icon, label, value }) => (
  <View style={styles.container}>
    <View style={styles.iconBox}>
      <Ionicons name={icon} size={18} color="#71717a" />
    </View>
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  iconBox: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  label: { fontSize: 12, color: '#71717a' },
  value: { fontSize: 14, fontWeight: '500', color: '#18181b' },
});