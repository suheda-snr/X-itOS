import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export type GameTimerHandle = {
  start: () => void;
  stop: () => void;
  getElapsedTime: () => number;
};

type Props = {
  durationMinutes: number; 
};

const GameTimer = React.forwardRef<GameTimerHandle, Props>(({ durationMinutes }, ref) => {
  const [timeLeft, setTimeLeft] = useState(Math.floor(durationMinutes * 60));
  const [isRunning, setIsRunning] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useImperativeHandle(ref, () => ({
    start() {
      const totalSeconds = Math.floor(durationMinutes * 60);
      setTimeLeft(totalSeconds);
      setIsRunning(true);
      setStartTimestamp(Date.now());
    },
    stop() {
      setIsRunning(false);
    },
    getElapsedTime() {
      if (!startTimestamp) return 0;
      const now = Date.now();
      return Math.floor((now - startTimestamp) / 1000);
    }
  }));

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return (
    <View style={styles.container}>
      <Text style={{ color: "#00ADB5", fontSize: 30 }}>Time left:</Text>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  );
});

export default GameTimer;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ADB5',
  },
});
