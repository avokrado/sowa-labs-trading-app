export const validateDecimalInput = (
  text: string,
  maxDecimals: number
): boolean => {
  // Allow empty input
  if (text === "") return true;

  // Basic decimal number format
  const decimalRegex = new RegExp(`^\\d*\\.?\\d{0,${maxDecimals}}$`);

  // Check if it matches our format and isn't just a decimal point
  return decimalRegex.test(text) && text !== ".";
};

export const formatDecimalInput = (text: string): string => {
  // If user enters a decimal point first, add leading zero
  if (text === ".") return "0.";

  // Remove leading zeros
  if (text.length > 1 && text.startsWith("0") && text[1] !== ".") {
    return text.replace(/^0+/, "");
  }

  return text;
};
