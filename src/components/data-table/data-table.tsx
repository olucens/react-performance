import type { YearData } from '../../types';
import { formatNumber } from '../../utils/format-utils';

import styles from './data-table.module.css';

type DataTableProps = {
  data: YearData[];
  year: number;
  columns: string[];
};

export const DataTable = ({ data, year, columns }: DataTableProps) => {
  const yearData = data.filter((d) => d.year === year);

  if (yearData.length === 0) {
    return <div className={styles.noData}>No data available for year {year}</div>;
  }

  const record = yearData[0];

  return (
    <table className={styles.table}>
      <tbody>
        {columns.map((column, index) => (
          <tr key={index} className={styles.row}>
            <td className={styles.labelCell}>{column.replace(/_/g, ' ').toUpperCase()}</td>
            <td className={styles.valueCell}>
              {formatNumber(record[column as keyof YearData] as number | undefined, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
