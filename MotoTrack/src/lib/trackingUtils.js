// src/lib/trackingUtils.js
export const MIN_MOTO_SPEED_KMH = 5;

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDuration(minutes) {
  if (!minutes || minutes < 1) return '0min';
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function formatSeconds(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatKm(km) {
  if (!km || km <= 0) return '0 km';
  if (km < 1) return `${(km * 1000).toFixed(0)}m`;
  return `${km.toFixed(1)} km`;
}

export function daysBetween(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return null;
  return Math.floor(
    Math.abs(new Date(dateStr2) - new Date(dateStr1)) / (1000 * 60 * 60 * 24)
  );
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}
