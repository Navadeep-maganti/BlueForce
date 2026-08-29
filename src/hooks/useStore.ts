import { useEffect, useState } from 'react';
import { appStore } from '../services/store';

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return appStore;
}
