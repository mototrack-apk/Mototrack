// src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { MapPin, Wifi, WifiOff } from 'lucide-react-native';
import { colors, radius } from '../lib/theme';
import { useTracking } from '../lib/useTracking';
import { getMaintenanceStatus } from '../lib/useMaintenanceAlerts';
import { getProfile, getTodaySessions } from '../lib/storage';
import { formatKm, formatSeconds } from '../lib/trackingUtils';
import TrackingButton from '../components/TrackingButton';
import StatCard from '../components/StatCard';
import MaintenanceCard from '../components/MaintenanceCard';

function formatMinutesCompact(totalMinutes) {
  if (!totalMinutes) return '0min';
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}min`;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [todaySessions, setTodaySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [prof, sessions] = await Promise.all([
        getProfile(),
        getTodaySessions(),
      ]);
      setProfile(prof);
      setTodaySessions(sessions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const { isTracking, currentKm, sessionSeconds, speed, locationError, startTracking, stopTracking } =
    useTracking(loadData);

  const todayKm =
    todaySessions.reduce((a, s) => a + (s.km_traveled || 0), 0) +
    (isTracking ? currentKm : 0);

  const todaySessionMinutes = todaySessions.reduce(
    (a, s) => a + (s.duration_minutes || 0),
    0
  );
  const todayTotalSeconds =
    todaySessionMinutes * 60 + (isTracking ? sessionSeconds : 0);

  const maintenanceItems = getMaintenanceStatus(profile);
  const urgentItems = maintenanceItems.filter((i) => i.due || i.warning);

  const handleToggle = () => {
    if (isTracking) stopTracking();
    else startTracking();
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const name = profile?.name?.split(' ')[0] || 'Motoboy';

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bem-vindo</Text>
          <Text style={styles.name}>{name} 👋</Text>
        </View>
        <View style={styles.gpsBadge}>
          <MapPin size={12} color={colors.mutedForeground} />
          <Text style={styles.gpsText}>GPS</Text>
          {isTracking ? (
            <Wifi size={12} color={colors.primary} />
          ) : (
            <WifiOff size={12} color={colors.mutedForeground} />
          )}
        </View>
      </View>

      {/* Tracking Card */}
      <View style={styles.trackCard}>
        {isTracking ? (
          <View style={styles.activeInfo}>
            <View style={styles.activeRow}>
              <View style={styles.activeDot} />
              <Text style={styles.activeLabel}>TRABALHANDO</Text>
            </View>
            <Text style={styles.timer}>{formatSeconds(sessionSeconds)}</Text>
            <Text style={styles.timerSub}>hh : mm : ss</Text>
            <Text style={styles.liveInfo}>
              {formatKm(currentKm)} • {speed} km/h
            </Text>
          </View>
        ) : (
          <View style={styles.idleInfo}>
            <Text style={styles.idleText}>Pressione para iniciar</Text>
            <Text style={styles.idleSub}>Rastreamento de tempo e distância</Text>
          </View>
        )}
        <TrackingButton
          isTracking={isTracking}
          onToggle={handleToggle}
        />
        {locationError && (
          <Text style={styles.locationError}>
            GPS não disponível. Ative a localização no seu dispositivo.
          </Text>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <StatCard icon="🏍️" label="KM hoje" value={formatKm(todayKm)} accent />
        <StatCard
          icon="⏱️"
          label="Tempo hoje"
          value={
            isTracking
              ? formatSeconds(todayTotalSeconds)
              : formatMinutesCompact(todaySessionMinutes)
          }
          sub={isTracking ? 'ao vivo' : null}
        />
        <StatCard
          icon="📍"
          label="Total acumulado"
          value={`${(profile?.total_km || 0).toFixed(0)} km`}
        />
        <StatCard
          icon="🔥"
          label="Sessões hoje"
          value={String(todaySessions.length + (isTracking ? 1 : 0))}
        />
      </View>

      {/* Alertas de manutenção */}
      {urgentItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Alertas de Manutenção</Text>
          <View style={styles.gap}>
            {urgentItems.map((item) => (
              <MaintenanceCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      )}

      {/* Ad placeholder */}
      <View style={styles.adPlaceholder}>
        <Text style={styles.adText}>ESPAÇO PARA ANÚNCIO</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 8,
  },
  welcome: {
    fontSize: 10,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.foreground,
    marginTop: 2,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondary,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  gpsText: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  trackCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  activeInfo: { alignItems: 'center', gap: 4 },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  activeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.5,
  },
  timer: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.foreground,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  timerSub: {
    fontSize: 10,
    color: colors.mutedForeground,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  liveInfo: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  idleInfo: { alignItems: 'center', gap: 4 },
  idleText: { fontSize: 14, color: colors.mutedForeground },
  idleSub: { fontSize: 11, color: colors.mutedForeground, opacity: 0.6 },
  locationError: {
    fontSize: 11,
    color: colors.destructive,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  gap: { gap: 10 },
  adPlaceholder: {
    height: 48,
    backgroundColor: `${colors.secondary}66`,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adText: {
    fontSize: 9,
    color: `${colors.mutedForeground}66`,
    letterSpacing: 2,
  },
});
