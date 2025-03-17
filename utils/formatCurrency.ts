export const formatCurrency = (
  value: number,
  locale = "de-DE",
  decimals = 2
) => {
  return value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
