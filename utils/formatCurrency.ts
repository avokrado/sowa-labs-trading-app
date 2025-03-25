/**
 * Formats a number as a Euro currency string using locale-specific formatting
 *
 * @param value - The number to format as currency
 * @param locale - The locale to use for formatting (defaults to German/EUR format)
 * @param decimals - Number of decimal places to show (defaults to 2)
 * @returns Formatted currency string (e.g. "1.234,56" for German locale)
 *
 * Examples:
 * - formatEurCurrency(1234.56) -> "1.234,56"
 * - formatEurCurrency(1234.56, "en-US") -> "1,234.56"
 * - formatEurCurrency(1234.56789, "de-DE", 3) -> "1.234,568"
 */
export const formatEurCurrency = (
  value: number,
  locale = "de-DE",
  decimals = 2
) => {
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
