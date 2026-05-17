// src/pages/Manutencao.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, radius } from '../lib/theme';
import { getProfile } from '../lib/storage';
import { getMaintenanceStatus } from '../lib/useMaintenanceAlerts';
import MaintenanceCard from '../components/MaintenanceCard';
import PageHeader from '../components/PageHeader';

export default function Manutencao() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then((p) => { setProfile(p); setLoading(false); });
  }, []);

  const items = getMaintenanceStatus(profile);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const interval = profile?.oil_change_interval_km || 2000;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <PageHeader title="Manutenção" subtitle="Status da sua moto" />

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Os lembretes de manutenção são{' '}
          <Text style={{ color: colors.primary, fontWeight: '700' }}>automáticos</Text>
          . Você receberá notificações quando cada item precisar de atenção.
        </Text>
      </View>

      <View style={styles.gap}>
        {items.map((item) => (
          <MaintenanceCard key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.freqCard}>
        <Text style={styles.freqTitle}>📅 Frequência dos Lembretes</Text>
        <View style={styles.freqList}>
          {[
            { icon: '🛢️', label: 'Troca de Óleo', detail: `A cada ${interval} km` },
            { icon: '🛞', label: 'Calibração dos Pneus', detail: 'A cada 15 dias' },
            { icon: '🔗', label: 'Lubrificação da Corrente', detail: 'A cada 5 dias' },
          ].map((r) => (
            <View key={r.label} style={styles.freqItem}>
              <Text style={styles.freqIcon}>{r.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.freqLabel}>{r.label}</Text>
                <Text style={styles.freqDetail}>{r.detail}</Text>
              </View>
              <Text style={styles.autoTag}>AUTO</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 100 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.mutedForeground },
  infoCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 14,
  },
  infoText: { fontSize: 12, color: colors.mutedForeground, lineHeight: 18 },
  gap: { gap: 10, marginBottom: 20 },
  freqCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
  },
  freqTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },
  freqList: { gap: 14 },
  freqItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  freqIcon: { fontSize: 20 },
  freqLabel: { fontSize: 12, fontWeight: '600', color: colors.foreground },
  freqDetail: { fontSize: 10, color: colors.mutedForeground, marginTop: 1 },
  autoTag: { fontSize: 9, fontWeight: '800', color: colors.primary, letterSpacing: 0.5 },
});
