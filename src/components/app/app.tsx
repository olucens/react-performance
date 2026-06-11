import { useState } from 'react';
import { useCo2Data } from '../../hooks/useCo2Data';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { SearchBar } from '../search-bar/search-bar';
import { YearSelector } from '../year-selector/year-selector';
import { CountryList } from '../country-list/country-list';
import { ColumnModal } from '../column-modal/column-modal';
import { getAvailableYears, getAvailableColumns } from '../../utils/data-transformers';

import styles from './app.module.css';

type AppState = {
  searchQuery: string;
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  selectedColumns: string[];
  isColumnModalOpen: boolean;
};

export const App = () => {
  const { data, isLoading, error } = useCo2Data();

  const [state, setState] = useState<AppState>({
    searchQuery: '',
    selectedRegion: '',
    selectedYear: 2020,
    sortField: 'population',
    sortOrder: 'desc',
    selectedColumns: ['year', 'population', 'co2', 'co2_per_capita'],
    isColumnModalOpen: false,
  });

  const years = data ? getAvailableYears(data) : [];
  const availableColumns = getAvailableColumns();

  const handleSearch = (value: string) => {
    setState({ ...state, searchQuery: value });
  };

  const handleYearChange = (year: number) => {
    setState({ ...state, selectedYear: year });
  };

  const handleSortFieldChange = (field: 'name' | 'population') => {
    setState({ ...state, sortField: field });
  };

  const handleSortOrderToggle = () => {
    setState({
      ...state,
      sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleColumnToggle = (column: string) => {
    setState({
      ...state,
      selectedColumns: state.selectedColumns.includes(column)
        ? state.selectedColumns.filter((c) => c !== column)
        : [...state.selectedColumns, column],
    });
  };

  const handleModalToggle = () => {
    setState({ ...state, isColumnModalOpen: !state.isColumnModalOpen });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.errorMessage}>Error: {error}</div>;
  }

  if (!data) {
    return <div className={styles.noDataMessage}>No data available</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CO₂ Emissions Data Explorer</h1>

      {/* Controls */}
      <div className={styles.controls}>
        <SearchBar value={state.searchQuery} onChange={handleSearch} />
        <YearSelector year={state.selectedYear} years={years} onChange={handleYearChange} />

        <div className={styles.sortContainer}>
          <label className={styles.sortLabel}>Sort by:</label>
          <select
            value={state.sortField}
            onChange={(e) => handleSortFieldChange(e.target.value as 'name' | 'population')}
            className={styles.sortSelect}
          >
            <option value="population">Population</option>
            <option value="name">Name</option>
          </select>

          <button onClick={handleSortOrderToggle} className={styles.sortButton}>
            {state.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className={styles.columnButtonContainer}>
          <button onClick={handleModalToggle} className={styles.columnButton}>
            Select columns ({state.selectedColumns.length} selected)
          </button>
        </div>
      </div>

      {/* Country List */}
      <CountryList
        countries={data}
        searchQuery={state.searchQuery}
        selectedColumns={state.selectedColumns}
        selectedRegion={state.selectedRegion}
        selectedYear={state.selectedYear}
        sortField={state.sortField}
        sortOrder={state.sortOrder}
        onYearChange={handleYearChange}
      />

      {/* Column Modal */}
      <ColumnModal
        isOpen={state.isColumnModalOpen}
        availableColumns={availableColumns}
        selectedColumns={state.selectedColumns}
        onToggle={handleColumnToggle}
        onClose={handleModalToggle}
      />
    </div>
  );
};
