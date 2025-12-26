"use client";

import { useState, useCallback } from 'react';
import type { Location } from '@/types';
import { getLocation } from '@/lib/tools';
import type { UseLocationReturn } from '@/types';

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLocation = useCallback(async (): Promise<Location | null> => {
    setLoading(true);
    setError(null);

    try {
      const loc = await getLocation();
      setLocation(loc);
      return loc;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    location,
    error,
    loading,
    getLocation: fetchLocation
  };
}
