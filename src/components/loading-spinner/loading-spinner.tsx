import styles from './loading-spinner.module.css';

export const LoadingSpinner = () => {
  return (
    <div className={styles.container}>
      <div className="spinner">Loading CO2 data...</div>
    </div>
  );
};
