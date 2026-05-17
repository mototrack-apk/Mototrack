// src/lib/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PROFILE: 'mototrack:profile',
  SESSIONS: 'mototrack:sessions',
};

// --- PROFILE ---
export async function getProfile() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROFILE);
    if (!raw) return createDefaultProfile();
    return JSON.parse(raw);
  } catch {
    return createDefaultProfile();
  }
}

export async function saveProfile(profile) {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  return profile;
}

function createDefaultProfile() {
  return {
    id: 'local',
    name: 'Motoboy',
    total_km: 0,
    km_since_oil_change: 0,
    oil_change_interval_km: 2000,
    last_oil_change_date: null,
    last_tire_check_date: null,
    last_chain_lube_date: null,
    notifications_enabled: true,
  };
}

// --- SESSIONS ---
export async function getSessions() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveSessions(sessions) {
  await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
}

export async function addSession(session) {
  const sessions = await getSessions();
  const updated = [session, ...sessions];
  await saveSessions(updated);
  return updated;
}

export async function getTodaySessions() {
  const today = getTodayString();
  const all = await getSessions();
  return all.filter((s) => s.date === today);
}

export async function getRecentSessions(days = 30) {
  const all = await getSessions();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return all.filter((s) => new Date(s.date) >= cutoff);
}

// --- UTILS ---
export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}
