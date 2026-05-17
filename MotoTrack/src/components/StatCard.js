// src/components/StatCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../lib/theme';

export default function StatCard({ icon, label, value, sub, accent }) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, accent && styles.accentValue]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 2,
  },
  icon: {
    fontSize: 22,
    marginBottom: 2,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.foreground,
    marginTop: 2,
  },
  accentValue: {
    color: colors.primary,
  },
  label: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  sub: {
    fontSize: 10,
    color: colors.mutedForeground,
    marginTop: 1,
    opacity: 0.7,
  },
});
