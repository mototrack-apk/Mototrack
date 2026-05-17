// src/pages/Historico.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { colors, radius } from '../lib/theme';
import { getRecentSessions } from '../lib/storage';
import { formatDuration, formatKm } from '../lib/trackingUtils';
import PageHeader from '../components/PageHeader';

export default function Historico() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getRecentSessions(30);
      setSessions(data);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  const totalKm = sessions.reduce((a, s) => a + (s.km_traveled || 0), 0);
  const totalMinutes = sessions.reduce((a, s) => a + (s.duration_minutes || 0), 0);

  // Agrupa por data para o gráfico manual
  const byDate = sessions.reduce((acc, s) => {
    const d = s.date;
    if (!acc[d]) acc[d] = { date: d, km: 0 };
    acc[d].km += s.km_traveled || 0;
    return acc;
  }, {});
  const chartData = Object.values(byDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);
  const maxKm = Math.max(...chartData.map((d) => d.km), 1);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
      }
    >
      <PageHeader title="Histórico" subtitle="Últimas atividades" />

      {/* Totais */}
      <View style={styles.totalsRow}>
        <View style={styles.totalCard}>
          <Text style={styles.totalValue}>{totalKm.toFixed(1)} km</Text>
          <Text style={styles.totalLabel}>Total rodado</Text>
        </View>
        <View style={styles.totalCard}>
          <Text style={[styles.totalValue, { color: colors.foreground }]}>{formatDuration(totalMinutes)}</Text>
          <Text style={styles.totalLabel}>Tempo total</Text>
        </View>
      </View>

      {/* Gráfico de barras manual */}
      {chartData.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>KM por dia (7 dias)</Text>
          <View style={styles.chartArea}>
            {chartData.map((d, i) => {
              const barHeight = Math.max(4, (d.km / maxKm) * 100);
              const label = format(parseISO(d.date), 'dd/MM', { locale: ptBR });
              const shade = Math.max(35, 55 - i * 3);
              return (
                <View key={d.date} style={styles.barGroup}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: `hsl(25, 95%, ${shade}%)`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Lista de sessões */}
      <View style={styles.gap}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : sessions.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏍️</Text>
            <Text style={styles.emptyText}>Nenhuma sessão registrada ainda.</Text>
          </View>
        ) : (
          sessions.map((s) => (
            <View key={s.id} style={styles.sessionCard}>
              <View>
                <Text style={styles.sessionDate}>
                  {format(parseISO(s.date), "dd 'de' MMMM", { locale: ptBR })}
                </Text>
                <Text style={styles.sessionTime}>
                  {s.start_time
                    ? format(new Date(s.start_time), 'HH:mm')
                    : '--'}{' '}
                  • {formatDuration(s.duration_minutes || 0)}
                </Text>
              </View>
              <View style={styles.sessionRight}>
                <Text style={styles.sessionKm}>{formatKm(s.km_traveled || 0)}</Text>
                <Text style={styles.sessionStatus}>Concluída</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 100 },
  totalsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  totalCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
  },
  totalValue: { fontSize: 22, fontWeight: '900', color: colors.primary },
  totalLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 3 },
  chartCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 110,
    gap: 4,
  },
  barGroup: { flex: 1, alignItems: 'center', height: 110, justifyContent: 'flex-end' },
  barWrapper: { flex: 1, justifyContent: 'flex-end', width: '100%', alignItems: 'center' },
  bar: { width: '70%', borderRadius: 4 },
  barLabel: { fontSize: 9, color: colors.mutedForeground, marginTop: 5 },
  gap: { gap: 10 },
  loadingContainer: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { color: colors.mutedForeground },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 13, color: colors.mutedForeground },
  sessionCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionDate: { fontSize: 13, fontWeight: '600', color: colors.foreground },
  sessionTime: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  sessionRight: { alignItems: 'flex-end' },
  sessionKm: { fontSize: 15, fontWeight: '800', color: colors.primary },
  sessionStatus: { fontSize: 9, color: colors.mutedForeground, textTransform: 'uppercase', marginTop: 2 },
});
