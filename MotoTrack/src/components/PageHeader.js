// src/components/PageHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, radius } from '../lib/theme';

export default function PageHeader({ title, subtitle, showBack = false }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft size={20} color={colors.foreground} strokeWidth={2.2} />
        </TouchableOpacity>
      )}
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingTop: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.foreground,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 11,
    color: colors.mutedForeground,
    marginTop: 1,
  },
});
