import { useState, useEffect } from 'react';
import type { Country, YearData } from '../types';

export const useCo2Data = () => {
  const [data, setData] = useState<Country[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/data/owid-co2-data.json');

        if (!res.ok) {
          throw new Error('Failed to fetch CO2 data');
        }

        const json = await res.json();

        const parsed = Object.entries(json).map(([countryName, countryData]) => {
          const data = countryData as { iso_code?: string; data: YearData[] };
          return {
            id: countryName,
            iso_code: data.iso_code,
            data: data.data,
          };
        }) as Country[];

        setData(parsed);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
