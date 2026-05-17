// src/lib/useTracking.js
import { useState, useRef, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { AppState } from 'react-native';
import { haversineDistance, getTodayString } from './trackingUtils';
import { addSession, getProfile, saveProfile } from './storage';

export function useTracking(onSessionSaved) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentKm, setCurrentKm] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [locationError, setLocationError] = useState(false);

  const locationSub = useRef(null);
  const timerRef = useRef(null);
  const lastPosition = useRef(null);
  const kmRef = useRef(0);
  const startTimeRef = useRef(null);
  const appState = useRef(AppState.currentState);

  // Timer tick
  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setSessionSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTracking]);

  const startTracking = useCallback(async () => {
    setLocationError(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationError(true);
      return;
    }

    kmRef.current = 0;
    lastPosition.current = null;
    startTimeRef.current = new Date();
    setCurrentKm(0);
    setSessionSeconds(0);
    setSpeed(0);
    setIsTracking(true);

    locationSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (loc) => {
        const { latitude, longitude, speed: spd } = loc.coords;
        const kmhSpeed = spd != null ? Math.max(0, spd * 3.6) : 0;
        setSpeed(Math.round(kmhSpeed));

        if (lastPosition.current) {
          const dist = haversineDistance(
            lastPosition.current.lat,
            lastPosition.current.lon,
            latitude,
            longitude
          );
          if (kmhSpeed >= 5 && dist < 0.5) {
            kmRef.current += dist;
            setCurrentKm(parseFloat(kmRef.current.toFixed(3)));
          }
        }
        lastPosition.current = { lat: latitude, lon: longitude };
      }
    );
  }, []);

  const stopTracking = useCallback(async () => {
    setIsTracking(false);
    locationSub.current?.remove();
    locationSub.current = null;

    const endTime = new Date();
    const startTime = startTimeRef.current || endTime;
    const durationMinutes = Math.round((endTime - startTime) / 60000);
    const km = parseFloat(kmRef.current.toFixed(3));

    if (km > 0.05 || durationMinutes > 0) {
      const session = {
        id: Date.now().toString(),
        date: getTodayString(),
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        km_traveled: km,
        duration_minutes: durationMinutes,
      };
      await addSession(session);

      // Atualizar totais no perfil
      const profile = await getProfile();
      await saveProfile({
        ...profile,
        total_km: (profile.total_km || 0) + km,
        km_since_oil_change: (profile.km_since_oil_change || 0) + km,
      });

      onSessionSaved?.();
    }

    setCurrentKm(0);
    setSessionSeconds(0);
    setSpeed(0);
    kmRef.current = 0;
  }, [onSessionSaved]);

  // Para rastreamento se o app for fechado
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (
        appState.current === 'active' &&
        nextState.match(/inactive|background/) &&
        isTracking
      ) {
        // Mantém rodando em background (expo-location já lida com isso)
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [isTracking]);

  return {
    isTracking,
    currentKm,
    sessionSeconds,
    speed,
    locationError,
    startTracking,
    stopTracking,
  };
}
