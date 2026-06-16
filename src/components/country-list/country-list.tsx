import { memo, useMemo } from 'react';
import { List, type RowComponentProps } from 'react-window';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

type RowProps = {
  items: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

const CountryRow = ({
  index,
  style,
  items,
  selectedYear,
  selectedColumns,
}: RowComponentProps<RowProps>) => (
  <div style={style}>
    <CountryCard
      country={items[index]}
      selectedYear={selectedYear}
      selectedColumns={selectedColumns}
    />
  </div>
);

export const CountryList = memo(({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();

    const filtered = countries.filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(lowerSearch);
      const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
      return matchesSearch && matchesRegion;
    });

    if (sortField === 'name') {
      return filtered.sort((a, b) =>
        sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
      );
    }

    // Pre-compute population per country once — avoids createYearDataMap inside sort comparator
    const withPop = filtered.map((c) => ({
      country: c,
      pop: getPopulationForYear(createYearDataMap(c.data), selectedYear) ?? 0,
    }));
    withPop.sort((a, b) => (sortOrder === 'asc' ? a.pop - b.pop : b.pop - a.pop));
    return withPop.map((x) => x.country);
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  // Height: card header+stats (~90px) + table rows (32px each) + padding (40px)
  const rowHeight = 90 + selectedColumns.length * 32 + 40;

  return (
    <div className={styles.countryList}>
      <List
        rowCount={filteredCountries.length}
        rowHeight={rowHeight}
        rowComponent={CountryRow}
        rowProps={{ items: filteredCountries, selectedYear, selectedColumns }}
        style={{ height: '600px' }}
      />
    </div>
  );
});
