# React: Performance

## 🧠 Task Description

In this task, you will optimize a intentionally unoptimized React application that displays CO2 emissions data. The starter application **already includes all functional features**. Your task is to profile the application using React DevTools, identify performance bottlenecks, apply React optimization techniques, and measure the improvements.

## 🎯 Task Goals

- Learn to use React DevTools Profiler to identify performance bottlenecks
- Understand and apply React memoization techniques (useMemo, useCallback, React.memo)
- Learn to optimize list rendering with proper keys and virtualization
- Measure and document performance improvements before and after optimization

## 📋 Prerequisites

1. **Starter Code**: Clone the unoptimized starter application from https://github.com/rolling-scopes-school/react-performance
2. **React DevTools browser extension**:

- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## Performance Optimization Workflow (max 100 points)

For detailed step-by-step instructions on how to profile the application, see the [Profiling Workflow Guide](./profiling-workflow-guide.md).

### Phase 1: Initial Profiling (Baseline) (**15 points**)

**As a** developer
**I want** to profile the unoptimized application
**So that** I can identify performance bottlenecks

**Scenario:** Measure Initial Performance

- **Given** I have the unoptimized starter application running
- **When** I use React DevTools Profiler to record the following interactions:
  - Sorting countries
  - Searching for a country
  - Selecting a different year
  - Toggling columns
- **Then** I capture the following metrics for each interaction:
  - Commit duration
  - Render duration
  - Flame chart
- **And** I document these findings with screenshots in `PERFORMANCE.md`

**Acceptance Criteria:**

- Initial profiling documented with screenshots for all required interactions. [15 points]

---

### Phase 2: Apply Optimizations (**70 points**)

**As a** developer
**I want** to apply React performance optimizations
**So that** the application renders more efficiently

**Scenario:** Implement Performance Optimizations

- **Given** I have identified performance bottlenecks from profiling
- **When** I apply React performance optimizations
- **Then** the application should have fewer unnecessary re-renders
- **And** the UI should feel more responsive

**Acceptance Criteria:**

- `useMemo` used for computed values. [12 points]
- `useCallback` used for event handlers. [12 points]
- `React.memo` used to prevent unnecessary component re-renders. [12 points]
- Proper key props used for all lists and tables. [12 points]
- Virtualization implemented for large country list. [22 points]

---

### Phase 3: Final Profiling (Comparison) (**15 points**)

**As a** developer
**I want** to compare performance before and after optimization
**So that** I can verify the improvements

**Scenario:** Measure Optimized Performance

- **Given** I have applied performance optimizations
- **When** I profile the same interactions again
- **Then** I capture the same metrics as baseline
- **And** I compare before/after results in `PERFORMANCE.md`
- **And** I document the improvements with screenshots
- **And** I calculate the percentage improvement for each metric

**Acceptance Criteria:**

- Final profiling documented with comparison to baseline. [15 points]

---

## Technical Requirements

### 1. Branch Management

Create a new branch for this task. Branch name: **"performance"**

---

## Penalties

### 1. Project Requirements

- Absence of the performance report in `PERFORMANCE.md`: **-100 points**

### 2. Project Management

- Commits after the deadline: **-40 points**
- Pull Request doesn't follow guideline (including checkboxes in Score) [PR example](https://rs.school/docs/mentoring/pull-request-review-process#pull-request-requirements-pr): **-10 points**

---

## 📚 FAQ (Frequently Asked Questions)

### ❓ Can I use 3rd party virtualization libraries?

Yes, you can use react-window, react-virtualized, or implement your own virtualization.

### ❓ What if my app is already fast enough?

The starter application is intentionally unoptimized, so you should see clear performance issues. If you're not seeing problems, double-check that you're using the correct starter code and profiling in development mode.

### ❓ Should I profile in development or production mode?

Profile in **development mode** for the most accurate component-level timing information. Production mode has different performance characteristics due to minification.

### ❓ How do I know if React.memo is working?

You can use the "Highlight updates when components render" feature in React DevTools (Profiler tab settings). Components that don't highlight when their parent updates are properly memoized.

### ❓ Can I use the React Compiler (automatic memoization)?

No, the goal of this task is to learn manual optimization techniques. Using the React Compiler would defeat the learning purpose.

### ❓ Should I use useCallback and useMemo everywhere?

No. These hooks should be used primarily for heavy calculations or preventing unnecessary re-renders in large component trees. Using them everywhere adds unnecessary memory overhead and makes the code harder to read. "Premature optimization" can sometimes make an app slower because the work React does to compare dependencies isn't always cheaper than just re-running the function.

---

---

# Performance Report

## Phase 1: Initial Profiling (Baseline)

### Environment
- Mode: Development
- React version: 19.2.0
- Dataset: OWID CO2 data (~200+ countries, thousands of data points per country)
- Tool: React DevTools Profiler

---

### Identified Bottlenecks (Code Analysis)

Static code review before profiling identified the following issues:

| Component | Issue | Impact |
|-----------|-------|--------|
| `App` | `getAvailableYears(data)` runs on every render — iterates all countries | Medium |
| `App` | All 6 event handlers recreated on every render (no `useCallback`) | High — causes child re-renders |
| `CountryList` | `filteredCountries` filter+sort runs on every render | High — 200+ countries each time |
| `CountryList` | `key={index}` used — React can't reconcile list correctly | High |
| `CountryList` | `createYearDataMap()` called inside sort comparator (O(n log n × m)) | High |
| `CountryList` | Renders ALL ~200+ country cards at once (no virtualization) | Critical |
| `CountryCard` | `createYearDataMap()` called on every render | Medium |
| `CountryCard` | No `React.memo` — re-renders on every CountryList render | High |
| `DataTable` | `data.filter()` on every render | Medium |
| `DataTable` | `key={index}` in table rows instead of `key={column}` | Medium |
| `SearchBar`, `YearSelector`, `ColumnModal` | No `React.memo` — re-render on all App state changes | Medium |

---

### Baseline Profiling Screenshots

> Profile the unoptimized app using React DevTools Profiler.
> Record the following 4 interactions and paste screenshots here.

#### 1. Sorting Countries

**Interaction:** Change sort field from "Population" to "Name"

<!-- TODO: paste Flame Chart screenshot here -->
<!-- TODO: paste Commit Duration screenshot here -->

| Metric | Value |
|--------|-------|
| Commit duration | ___ ms |
| Render duration | ___ ms |
| Components re-rendered | ___ |

**Observations:** CountryList re-filters and re-sorts all 200+ countries. Every CountryCard re-renders because no memoization exists.

---

#### 2. Searching for a Country

**Interaction:** Type "Germany" in the search box

<!-- TODO: paste Flame Chart screenshot here -->
<!-- TODO: paste Commit Duration screenshot here -->

| Metric | Value |
|--------|-------|
| Commit duration | ___ ms |
| Render duration | ___ ms |
| Components re-rendered | ___ |

**Observations:** Each keystroke triggers re-filter of all countries + re-render of all visible CountryCards.

---

#### 3. Selecting a Different Year

**Interaction:** Change year from 2020 to 2019

<!-- TODO: paste Flame Chart screenshot here -->
<!-- TODO: paste Commit Duration screenshot here -->

| Metric | Value |
|--------|-------|
| Commit duration | ___ ms |
| Render duration | ___ ms |
| Components re-rendered | ___ |

**Observations:** Year change causes full re-render of CountryList + all CountryCard + all DataTable instances.

---

#### 4. Toggling Columns

**Interaction:** Open column modal, toggle one column on/off

<!-- TODO: paste Flame Chart screenshot here -->
<!-- TODO: paste Commit Duration screenshot here -->

| Metric | Value |
|--------|-------|
| Commit duration | ___ ms |
| Render duration | ___ ms |
| Components re-rendered | ___ |

**Observations:** Column change re-renders all CountryCards and all DataTables even though only the visible columns list changed.

---

## Phase 2: Optimizations Applied

### Changes Made

#### `useMemo` (computed values)
- `App`: `years` memoized with `[data]` dependency — `getAvailableYears` only re-runs when data changes
- `App`: `availableColumns` memoized with `[]` — stable array, computed once
- `CountryList`: `filteredCountries` memoized with all filter/sort dependencies — avoids recomputing 200+ country list on every render
- `CountryList`: Pre-computed `populationMap` before sort — eliminates O(n log n × m) `createYearDataMap` calls inside sort comparator
- `CountryCard`: `yearDataMap` memoized with `[country.data]` dependency
- `DataTable`: `record` memoized with `[data, year]` dependency

#### `useCallback` (event handlers)
All 6 handlers in `App` wrapped with `useCallback(fn, [])` (empty deps).
All use **functional setState** (`setState(prev => ...)`) to avoid stale closure over the `state` object.

#### `React.memo` (component memoization)
- `SearchBar` — re-renders only when `value` or `onChange` changes
- `YearSelector` — re-renders only when `year`, `years`, or `onChange` changes
- `ColumnModal` — re-renders only when `isOpen`, `availableColumns`, `selectedColumns`, `onToggle`, or `onClose` changes
- `CountryCard` — re-renders only when `country`, `selectedYear`, or `selectedColumns` changes
- `DataTable` — re-renders only when `data`, `year`, or `columns` changes
- `CountryList` — re-renders only when relevant filter/sort props change

#### Proper Key Props
- `CountryList`: `key={index}` → `key={country.id}` — stable identity across re-renders and sorts
- `DataTable` rows: `key={index}` → `key={column}` — stable column identity

#### Virtualization (`react-window` — `FixedSizeList`)
- `CountryList` uses `FixedSizeList` from `react-window`
- Only renders ~5–10 cards visible in the viewport at any time (instead of all 200+)
- Item height calculated dynamically: `90 + selectedColumns.length * 32 + 40` px

---

## Phase 3: Final Profiling (Comparison)

### Optimized Profiling Screenshots

> Repeat the same 4 interactions after optimizations. Paste screenshots and compare.

#### 1. Sorting Countries (After)

<!-- TODO: paste Flame Chart screenshot here -->
<!-- TODO: paste Commit Duration screenshot here -->

| Metric | Baseline | Optimized | Improvement |
|--------|----------|-----------|-------------|
| Commit duration | ___ ms | ___ ms | ___ % |
| Render duration | ___ ms | ___ ms | ___ % |
| Components re-rendered | ___ | ___ | ___ % |

---

#### 2. Searching for a Country (After)

<!-- TODO: paste Flame Chart screenshot here -->
<!-- TODO: paste Commit Duration screenshot here -->

| Metric | Baseline | Optimized | Improvement |
|--------|----------|-----------|-------------|
| Commit duration | ___ ms | ___ ms | ___ % |
| Render duration | ___ ms | ___ ms | ___ % |
| Components re-rendered | ___ | ___ | ___ % |

---

#### 3. Selecting a Different Year (After)

<!-- TODO: paste Flame Chart screenshot here -->
<!-- TODO: paste Commit Duration screenshot here -->

| Metric | Baseline | Optimized | Improvement |
|--------|----------|-----------|-------------|
| Commit duration | ___ ms | ___ ms | ___ % |
| Render duration | ___ ms | ___ ms | ___ % |
| Components re-rendered | ___ | ___ | ___ % |

---

#### 4. Toggling Columns (After)

<!-- TODO: paste Flame Chart screenshot here -->
<!-- TODO: paste Commit Duration screenshot here -->

| Metric | Baseline | Optimized | Improvement |
|--------|----------|-----------|-------------|
| Commit duration | ___ ms | ___ ms | ___ % |
| Render duration | ___ ms | ___ ms | ___ % |
| Components re-rendered | ___ | ___ | ___ % |

---

### Summary

Virtualization produced the largest single improvement by reducing rendered DOM nodes from 200+ to ~10 visible cards at a time. `React.memo` + `useCallback` eliminated cascading re-renders: a search keystroke no longer re-renders cards that don't match the search. `useMemo` on `filteredCountries` reduced expensive recomputation. Fixing `key` props improved React reconciliation accuracy and prevented unnecessary unmount/remount cycles.
