// src/lib/useMaintenanceAlerts.js
import { daysBetween, getTodayString } from './trackingUtils';

export function getMaintenanceStatus(profile) {
  if (!profile) return [];
  const today = getTodayString();

  const oilKm = profile.km_since_oil_change || 0;
  const oilInterval = profile.oil_change_interval_km || 2000;
  const oilProgress = Math.min((oilKm / oilInterval) * 100, 100);
  const oilDue = oilKm >= oilInterval;
  const oilWarning = !oilDue && oilKm >= oilInterval * 0.85;

  const tireDays = daysBetween(profile.last_tire_check_date, today) ?? 999;
  const tireDue = tireDays >= 15;
  const tireWarning = !tireDue && tireDays >= 12;
  const tireProgress = Math.min((tireDays / 15) * 100, 100);

  const chainDays = daysBetween(profile.last_chain_lube_date, today) ?? 999;
  const chainDue = chainDays >= 5;
  const chainWarning = !chainDue && chainDays >= 4;
  const chainProgress = Math.min((chainDays / 5) * 100, 100);

  return [
    {
      id: 'oil',
      icon: '🛢️',
      label: 'Troca de Óleo',
      detail: `${oilKm.toFixed(0)} / ${oilInterval} km`,
      due: oilDue,
      warning: oilWarning,
      progress: oilProgress,
    },
    {
      id: 'tires',
      icon: '🛞',
      label: 'Calibração dos Pneus',
      detail: tireDays < 999 ? `${tireDays} dias desde a última` : 'Nunca calibrado',
      due: tireDue,
      warning: tireWarning,
      progress: tireProgress,
    },
    {
      id: 'chain',
      icon: '🔗',
      label: 'Lubrificação da Corrente',
      detail: chainDays < 999 ? `${chainDays} dias desde a última` : 'Nunca lubrificado',
      due: chainDue,
      warning: chainWarning,
      progress: chainProgress,
    },
  ];
}
