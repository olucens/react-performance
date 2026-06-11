/**
 * Formats a number as a localized string.
 * Returns 'N/A' for undefined or null values.
 *
 * @param value - The number to format, or undefined/null
 * @param options - Intl.NumberFormat options (default: { maximumFractionDigits: 0 })
 * @returns Formatted string or 'N/A'
 */
export const formatNumber = (
  value: number | undefined,
  options?: Intl.NumberFormatOptions
): string => {
  if (value === undefined || value === null) {
    return 'N/A';
  }

  return value.toLocaleString('en-US', options ?? { maximumFractionDigits: 0 });
};
