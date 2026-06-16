# React Performance — CO₂ Emissions Data Explorer

RS School task: profile and optimize an intentionally unoptimized React application displaying CO₂ emissions data.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in the browser.

## Optimizations Applied

- **`useMemo`** — memoized `getAvailableYears`, `getAvailableColumns`, `filteredCountries` sort/filter, `createYearDataMap` per card, year record lookup in DataTable
- **`useCallback`** — all 6 event handlers in `App` with functional `setState` to avoid stale closures
- **`React.memo`** — `SearchBar`, `YearSelector`, `ColumnModal`, `CountryCard`, `DataTable`, `CountryList`
- **Key props** — `key={country.id}` in CountryList, `key={column}` in DataTable rows
- **Virtualization** — `react-window` `List` renders only visible cards instead of all 200+

## Performance Report

See [PERFORMANCE.md](./PERFORMANCE.md) for baseline and optimized profiling results.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
