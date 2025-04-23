import { useEffect, useRef } from 'react';

type ScheduledAction = {
  after: number;
  action: () => void;
};

export function useHintScheduler(start: boolean, schedule: ScheduledAction[] = []) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  
    if (!start) return;
  
    schedule.forEach(({ after, action }) => {
      const timeoutId = setTimeout(() => {
        action();
      }, after * 60 * 1000);
  
      timersRef.current.push(timeoutId);
    });
  
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [start]);
  
}
