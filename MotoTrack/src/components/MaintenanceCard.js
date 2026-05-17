// src/components/MaintenanceCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../lib/theme';

export default function MaintenanceCard({ item }) {
  const isDue = item.due;
  const isWarning = !isDue && item.warning;

  const borderColor = isDue
    ? `${colors.destructive}55`
    : isWarning
    ? '#facc1555'
    : colors.border;

  const bgColor = isDue
    ? `${colors.destructive}10`
    : isWarning
    ? '#facc1510'
    : colors.card;

  const barColor = isDue
    ? colors.destructive
    : isWarning
    ? '#facc15'
    : colors.primary;

  const textColor = isDue
    ? colors.destructive
    : isWarning
    ? '#facc15'
    : colors.foreground;

  return (
    <View style={[styles.card, { borderColor, backgroundColor: bgColor }]}>
      <View style={styles.top}>
        <View style={styles.left}>
          <Text style={styles.icon}>{item.icon}</Text>
          <View>
            <Text style={[styles.label, { color: textColor }]}>{item.label}</Text>
            <Text style={styles.detail}>{item.detail}</Text>
          </View>
        </View>
        {isDue && <Text style={[styles.badge, { color: colors.destructive }]}>VENCIDO</Text>}
        {!isDue && isWarning && <Text style={[styles.badge, { color: '#facc15' }]}>EM BREVE</Text>}
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${item.progress}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  detail: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 1,
  },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  barBg: {
    width: '100%',
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 99,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 99,
  },
});
