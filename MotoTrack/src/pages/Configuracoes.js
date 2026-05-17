// src/pages/Configuracoes.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { colors, radius } from '../lib/theme';
import { getProfile, saveProfile } from '../lib/storage';
import PageHeader from '../components/PageHeader';

function Row({ label, children }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function Configuracoes() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [oilInterval, setOilInterval] = useState('2000');
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      setName(p.name || '');
      setOilInterval(String(p.oil_change_interval_km || 2000));
      setNotifications(p.notifications_enabled !== false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = {
        ...profile,
        name: name.trim() || 'Motoboy',
        oil_change_interval_km: parseInt(oilInterval) || 2000,
        notifications_enabled: notifications,
      };
      await saveProfile(updated);
      setProfile(updated);
      Alert.alert('Salvo', 'Configurações salvas com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
    setSaving(false);
  };

  const handleResetOil = async () => {
    Alert.alert(
      'Resetar troca de óleo?',
      'Isso vai zerar o contador desde a última troca.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: async () => {
            const updated = {
              ...profile,
              km_since_oil_change: 0,
              last_oil_change_date: new Date().toISOString().split('T')[0],
            };
            await saveProfile(updated);
            setProfile(updated);
            Alert.alert('Feito!', 'Contador de óleo resetado.');
          },
        },
      ]
    );
  };

  const handleResetTires = async () => {
    const updated = {
      ...profile,
      last_tire_check_date: new Date().toISOString().split('T')[0],
    };
    await saveProfile(updated);
    setProfile(updated);
    Alert.alert('Feito!', 'Data de calibração dos pneus atualizada.');
  };

  const handleResetChain = async () => {
    const updated = {
      ...profile,
      last_chain_lube_date: new Date().toISOString().split('T')[0],
    };
    await saveProfile(updated);
    setProfile(updated);
    Alert.alert('Feito!', 'Data de lubrificação da corrente atualizada.');
  };

  if (!profile) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: colors.mutedForeground }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <PageHeader title="Configurações" subtitle="Ajuste seu perfil" />

      {/* Perfil */}
      <Text style={styles.section}>Perfil</Text>
      <View style={styles.card}>
        <Row label="Seu nome">
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: João"
            placeholderTextColor={colors.mutedForeground}
          />
        </Row>
      </View>

      {/* Manutenção */}
      <Text style={styles.section}>Manutenção</Text>
      <View style={styles.card}>
        <Row label="Intervalo troca de óleo (km)">
          <TextInput
            style={styles.input}
            value={oilInterval}
            onChangeText={setOilInterval}
            keyboardType="numeric"
            placeholderTextColor={colors.mutedForeground}
          />
        </Row>
      </View>

      {/* Registrar manutenções */}
      <Text style={styles.section}>Registrar manutenção feita</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleResetOil}>
          <Text style={styles.actionIcon}>🛢️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionLabel}>Troquei o óleo agora</Text>
            <Text style={styles.actionSub}>Zera o contador de KM</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionBtn} onPress={handleResetTires}>
          <Text style={styles.actionIcon}>🛞</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionLabel}>Calibrei os pneus agora</Text>
            <Text style={styles.actionSub}>Atualiza a data</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionBtn} onPress={handleResetChain}>
          <Text style={styles.actionIcon}>🔗</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionLabel}>Lubrifiquei a corrente agora</Text>
            <Text style={styles.actionSub}>Atualiza a data</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Notificações */}
      <Text style={styles.section}>Notificações</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Alertas de manutenção</Text>
            <Text style={styles.rowSub}>Receba lembretes automáticos</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: `${colors.primary}66` }}
            thumbColor={notifications ? colors.primary : colors.mutedForeground}
          />
        </View>
      </View>

      {/* Salvar */}
      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
      >
        <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : 'Salvar alterações'}</Text>
      </TouchableOpacity>

      {/* Info total */}
      <View style={styles.statsInfo}>
        <Text style={styles.statsInfoText}>
          Total acumulado: {(profile.total_km || 0).toFixed(1)} km
        </Text>
        <Text style={styles.statsInfoText}>
          Desde última troca de óleo: {(profile.km_since_oil_change || 0).toFixed(1)} km
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 100 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  section: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  rowLabel: { flex: 1, fontSize: 13, color: colors.foreground, fontWeight: '500' },
  rowSub: { fontSize: 10, color: colors.mutedForeground, marginTop: 1 },
  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: colors.foreground,
    fontSize: 13,
    minWidth: 100,
    textAlign: 'right',
  },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 14 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  actionIcon: { fontSize: 22 },
  actionLabel: { fontSize: 13, color: colors.foreground, fontWeight: '500' },
  actionSub: { fontSize: 10, color: colors.mutedForeground, marginTop: 1 },
  actionArrow: { fontSize: 16, color: colors.mutedForeground },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  statsInfo: {
    marginTop: 20,
    gap: 4,
    alignItems: 'center',
  },
  statsInfoText: { fontSize: 11, color: `${colors.mutedForeground}99` },
});
