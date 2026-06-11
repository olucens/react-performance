# React Performance Optimization — Конспект урока

## Контекст

Приложение: CO₂ Emissions Data Explorer — отображает данные по выбросам CO₂ (~200+ стран).  
Стек: React 19, Vite, TypeScript.  
Задача: найти и устранить performance bottlenecks с помощью React DevTools Profiler.

---

## Инструменты профилирования

### React DevTools Profiler
- Вкладка **Profiler** в браузерном расширении React DevTools
- Режим: **development** (в production React оптимизирует иначе, данные профайлера будут отличаться)
- Ключевые метрики:
  - **Commit duration** — время от начала рендера до обновления DOM
  - **Render duration** — время работы функций компонентов
  - **Flame chart** — визуализация дерева рендеров, показывает какой компонент сколько занял
- **"Highlight updates when components render"** — подсвечивает компоненты при каждом ре-рендере, позволяет визуально видеть лишние ре-рендеры

---

## Паттерн 1: `useMemo` — мемоизация вычислений

### Суть
Кеширует результат вычисления между рендерами. Пересчитывает только при изменении зависимостей.

```tsx
// ❌ Пересчитывается при каждом рендере App
const years = data ? getAvailableYears(data) : [];

// ✅ Пересчитывается только когда data изменится
const years = useMemo(() => (data ? getAvailableYears(data) : []), [data]);
```

### Когда применять
- Тяжёлые вычисления: фильтрация/сортировка больших массивов
- Создание производных структур данных (Map, Set из массива)
- Вычисления, результат которых передаётся в `React.memo`-компоненты

### Когда НЕ применять
- Простые вычисления — накладные расходы мемоизации дороже самого вычисления
- Везде подряд "на всякий случай" — захламляет код и ухудшает читаемость

### Anti-pattern из проекта: вычисление внутри sort-компаратора

```tsx
// ❌ O(n log n × m) — createYearDataMap вызывается при каждом сравнении
.sort((a, b) => {
  const popA = getPopulationForYear(createYearDataMap(a.data), year) || 0;
  const popB = getPopulationForYear(createYearDataMap(b.data), year) || 0;
  return popA - popB;
});

// ✅ O(n) — вычисляем значения один раз ДО сортировки
const withPop = filtered.map(c => ({
  country: c,
  pop: getPopulationForYear(createYearDataMap(c.data), year) ?? 0,
}));
withPop.sort((a, b) => a.pop - b.pop);
return withPop.map(x => x.country);
```

---

## Паттерн 2: `useCallback` — мемоизация функций

### Суть
Стабилизирует **ссылочную идентичность** функции между рендерами. Функция пересоздаётся только при изменении зависимостей.

```tsx
// ❌ Новая функция при каждом рендере → React.memo на дочернем компоненте бесполезен
const handleSearch = (value: string) => {
  setState({ ...state, searchQuery: value });
};

// ✅ Стабильная функция — дочерний компонент не перерендеривается зря
const handleSearch = useCallback((value: string) => {
  setState(prev => ({ ...prev, searchQuery: value }));
}, []);
```

### Ключевой нюанс: функциональный `setState` для пустых зависимостей

Проблема: если обработчик читает текущий `state`, нужно добавить `state` в deps → callback пересоздаётся при каждом изменении состояния → смысл теряется.

Решение: **функциональная форма** `setState(prev => ...)` — получает актуальное состояние без захвата в closure → deps пустые `[]`, callback создаётся **один раз** за жизнь компонента.

```tsx
// ❌ state в зависимостях — callback пересоздаётся каждый рендер
const handleToggle = useCallback(() => {
  setState({ ...state, isOpen: !state.isOpen }); // захватывает state из closure
}, [state]);

// ✅ Функциональный update — читает актуальный state без зависимости от него
const handleToggle = useCallback(() => {
  setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
}, []);
```

---

## Паттерн 3: `React.memo` — предотвращение ре-рендеров компонентов

### Суть
HOC, оборачивающий компонент. Делает **shallow-сравнение** пропсов перед рендером. Если пропсы не изменились — пропускает рендер.

```tsx
// ❌ Перерендеривается при любом изменении состояния родителя
export const SearchBar = ({ value, onChange }) => { ... };

// ✅ Рендерится только когда value или onChange изменились
export const SearchBar = memo(({ value, onChange }) => { ... });
```

### Критическое условие: `memo` работает только вместе с `useCallback`/`useMemo`

Если пропс — inline-функция или inline-объект, `memo` бесполезен:

```tsx
// ❌ Каждый рендер App создаёт новую функцию → memo всегда видит "новый" проп
<SearchBar onChange={(value) => setState(...)} />

// ✅ Стабильная ссылка → memo работает как ожидается
const handleSearch = useCallback(...);
<SearchBar onChange={handleSearch} />
```

### Когда применять
- Компоненты, которые часто получают одни и те же пропсы, но родитель ре-рендерится
- "Листовые" компоненты в дереве с дорогим рендером
- Компоненты-списки (каждый элемент)

---

## Паттерн 4: Правильные `key` в списках

### Суть
`key` — идентификатор для React, позволяющий определить что **переместилось**, а что **изменилось**. Должен быть **стабильным** (не меняться между рендерами) и **уникальным** в пределах списка.

```tsx
// ❌ Индекс нестабилен при сортировке/фильтрации
filteredCountries.map((country, index) => <CountryCard key={index} ... />)

// ✅ Стабильный ID — React корректно переиспользует компоненты
filteredCountries.map((country) => <CountryCard key={country.id} ... />)

// ✅ Для строк таблицы — имя колонки как ключ
columns.map((column) => <tr key={column} ... />)
```

### Почему это важно
При `key={index}` после сортировки: карточка "Germany" была на позиции 50 (key=50), теперь на позиции 1 (key=1). React думает что компонент с key=1 **изменился** (это был "Afghanistan"), а не что "Germany" **переместилась**. Результат: unmount старого + mount нового вместо простого перемещения DOM-узла. При стабильном `key="Germany"` React просто перемещает существующий компонент.

---

## Паттерн 5: Виртуализация списков

### Суть
Вместо рендера **всех** элементов списка — рендерить только **видимые** в текущем viewport. Остальные заменяются пустым пространством нужной высоты.

```
Без виртуализации:  [Card1][Card2]...[Card200]  ← 200 DOM-узлов в дереве
С виртуализацией:   [----][----][Card10][Card11][Card12][----][----]  ← ~5 DOM-узлов
```

### `react-window` v2 API

```tsx
import { List, type RowComponentProps } from 'react-window';

type RowProps = {
  items: Country[];
  selectedYear: number;
  selectedColumns: string[];
};

// Компонент строки получает { index, style, ...rowProps }
const CountryRow = ({ index, style, items, selectedYear, selectedColumns }: RowComponentProps<RowProps>) => (
  <div style={style}>  {/* style ОБЯЗАТЕЛЕН — задаёт позицию в виртуальном списке */}
    <CountryCard country={items[index]} selectedYear={selectedYear} selectedColumns={selectedColumns} />
  </div>
);

// Список с фиксированной высотой контейнера
<List
  rowCount={filteredCountries.length}
  rowHeight={rowHeight}                          // px, или функция (index) => px
  rowComponent={CountryRow}
  rowProps={{ items: filteredCountries, selectedYear, selectedColumns }}
  style={{ height: '600px' }}                   // обязательно — фиксированная высота
/>
```

> **Важно:** react-window v2 (2.x) использует `List` + `rowComponent`/`rowProps`.  
> react-window v1 (1.x) использовал `FixedSizeList` + children render prop.  
> Это **несовместимые API**.

### Динамическая высота строки

Если высота элементов зависит от пропсов (например, количества колонок), считаем её:

```tsx
const rowHeight = 90 + selectedColumns.length * 32 + 40;
// base(header+stats) + (строк_таблицы × высота_строки) + padding
```

### Когда применять
- Списки от ~50–100 элементов, особенно если каждый элемент сложный
- Бесконечная прокрутка / пагинация
- Таблицы с большим количеством строк

---

## Порядок применения оптимизаций (правильная последовательность)

```
1. Профилировать → найти реальный bottleneck (не гадать)
2. useCallback на обработчиках в родителе
3. React.memo на дочерних компонентах (иначе useCallback бесполезен)
4. useMemo для дорогих вычислений (особенно filter/sort/map больших массивов)
5. Исправить key-пропсы (бесплатно, делать всегда)
6. Виртуализация для длинных списков
7. Профилировать снова → измерить улучшение
```

---

## Сводная таблица инструментов

| Инструмент | Что решает | Главное условие |
|------------|------------|-----------------|
| `useMemo` | Дорогое вычисление при каждом рендере | Зависимости в массиве точны |
| `useCallback` | Нестабильная функция-проп разрушает memo | Использовать `setState(prev=>...)` |
| `React.memo` | Компонент рендерится без изменения пропсов | Пропсы должны быть стабильны по ссылке |
| Правильные `key` | Неверная reconciliation при сортировке/фильтрации | Уникальный ID, не index |
| Виртуализация | Слишком много DOM-узлов в дереве | Фиксированная высота контейнера |

---

## Ссылки

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [memo](https://react.dev/reference/react/memo)
- [react-window](https://github.com/bvaughn/react-window)
- [Profiling React App Performance](https://react.dev/learn/react-developer-tools#profiling-performance)
