// src/components/TrackingButton.js
import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Animated,
  StyleSheet,
} from 'react-native';
import { Play, Square } from 'lucide-react-native';
import { colors } from '../lib/theme';

export default function TrackingButton({ isTracking, onToggle, disabled }) {
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0.6)).current;
  const opacity2 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (isTracking) {
      const anim1 = Animated.loop(
        Animated.parallel([
          Animated.timing(pulse1, { toValue: 2.2, duration: 2000, useNativeDriver: true }),
          Animated.timing(opacity1, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      );
      const anim2 = Animated.loop(
        Animated.parallel([
          Animated.timing(pulse2, { toValue: 1.9, duration: 2000, delay: 500, useNativeDriver: true }),
          Animated.timing(opacity2, { toValue: 0, duration: 2000, delay: 500, useNativeDriver: true }),
        ])
      );
      anim1.start();
      anim2.start();
      return () => {
        anim1.stop();
        anim2.stop();
        pulse1.setValue(1);
        pulse2.setValue(1);
        opacity1.setValue(0.6);
        opacity2.setValue(0.4);
      };
    }
  }, [isTracking]);

  const bgColor = isTracking ? colors.destructive : colors.primary;

  return (
    <View style={styles.container}>
      {isTracking && (
        <>
          <Animated.View
            style={[
              styles.pulse,
              { transform: [{ scale: pulse1 }], opacity: opacity1, backgroundColor: colors.primary },
            ]}
          />
          <Animated.View
            style={[
              styles.pulse,
              { transform: [{ scale: pulse2 }], opacity: opacity2, backgroundColor: colors.primary },
            ]}
          />
        </>
      )}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onToggle}
        disabled={disabled}
        style={[styles.button, { backgroundColor: bgColor }, disabled && styles.disabled]}
      >
        {isTracking ? (
          <Square size={28} color="#fff" fill="#fff" />
        ) : (
          <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  pulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 10,
  },
  disabled: {
    opacity: 0.5,
  },
});
